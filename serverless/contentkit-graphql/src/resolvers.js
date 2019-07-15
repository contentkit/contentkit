const GraphQLJSON = require('graphql-type-json')
const snakeCase = require('lodash.snakecase')
const pg = require('postgres-tools')

const randomBytes = require('crypto').randomBytes

const { AuthenticationError, ValidationError } = require('apollo-server-lambda')

async function createUser (_, args, ctx) {
  let { email, password } = args
  let user = await pg.head(`
    INSERT INTO users(email, password)
    SELECT $1, $2
    WHERE NOT EXISTS(
      SELECT * FROM users WHERE email = $1
    )
    RETURNING *
  `, [email, password])
  if (user) {
    return user
  } else {
    throw new ValidationError('User exists')
  }
}

async function signinUser (_, { email, password }, ctx) {
  let user = await pg.head(`
  SELECT
    users.*,
    sign(
      JSON_BUILD_OBJECT(
        'sub', users.id,
        'exp', (select extract(epoch from now() + interval '1' day)::int)
      ),
      users.password
    ) as token
  FROM
    users
  WHERE
    email = $1
  AND
    password = crypt($2, password);
  `, [email, password]).catch(err => {
    throw new AuthenticationError(err)
  })
  if (user) {
    return user
  } else {
    throw new AuthenticationError('Could not login with provided credentials')
  }
}

const updateUser = (_, args, ctx) => {
  return pg.head(`
    UPDATE
      users
    SET
      email = $1::text,
      name = $2::text
    WHERE id = $3
    RETURNING *
  `, [args.email, args.name, ctx.user])
}

const deleteUser = (_, args, ctx) => {
  return pg.head(`
    DELETE FROM users WHERE id = $1::text RETURNING *
  `, [ctx.user])
}

const createPost = (_, { title, projectId }, ctx) => {
  return pg.head(`
    insert into posts(
      project_id,
      title
    )
    values($1, $2) RETURNING *
  `, [projectId, title])
}

const updateDocument = async (_, { id, raw, encodedHtml }, ctx) => {
  raw.blocks = raw.blocks
    .map(block => {
      if (block.text) block.text = block.text.replace(/'/g, `''`)
      return block
    })

  const versionId = randomBytes(8).toString('hex')
  await ctx.context.redis.set(
    `${id}/${versionId}`,
    JSON.stringify({
      user: ctx.user,
      document_id: id,
      id: versionId,
      raw: raw,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
  )

  return pg.head(`
    UPDATE documents set raw = '${JSON.stringify(raw)}'::jsonb, encoded_html = '${encodedHtml}'
    WHERE id = '${id}' returning *
  `)
}

const deleteVersion = (_, { id }, ctx) => {
  ctx.context.redis.del(id)
  return {
    id
  }
  // return pg.query(`
  //   DELETE FROM versions WHERE id = $1 RETURNING *
  // `, [id])
}

const updatePost = (parent, args, ctx) => {
  args.status = args.status || 'DRAFT'
  let { id, ...rest } = args

  let params = Object.keys(rest).reduce((acc, key) => {
    let type = key === 'publishedAt'
      ? 'timestamp'
      : key === 'status'
        ? 'post_status'
        : 'text'
    acc.push(`${snakeCase(key)} = '${rest[key]}'::${type}`)
    return acc
  }, [])

  return pg.head(`
    UPDATE
      posts
    SET
      ${params.join(', ')}
    WHERE id = '${args.id}'
    RETURNING *
  `)
}

const createImage = (_, args, ctx) => {
  return pg.head(`
    INSERT INTO images(post_id, url)
    VALUES(
      '${args.postId}',
      '${args.url}'
    )
    RETURNING *
  `)
}

const deleteImage = (_, args, ctx) => {
  return pg.head(`
    DELETE FROM images
    WHERE id = $1
    RETURNING *
  `, [args.id, ctx.user])
}

const createVersion = (_, args, ctx) => {
  const versionId = randomBytes(8).toString('hex')
  return ctx.context.redis.set(
    `${args.documentId}/${versionId}`,
    JSON.stringify({
      user: ctx.user,
      document_id: args.documentId,
      id: versionId,
      raw: args.raw
    })
  )
  // return pg.query(`
  //   INSERT INTO versions(document_id, raw)
  //   VALUES($1, $2::jsonb)
  //   RETURNING *
  // `, [ctx.documentId, JSON.stringify(args.raw)])
}

const deletePost = (_, args, ctx) => {
  return pg.head(`
    DELETE FROM posts WHERE id = $1 RETURNING *
  `, [args.id])
}

const createDocument = (_, args, context) => {
  return pg.head(`
    INSERT INTO document(post_id, raw)
    VALUES(
      $1::text,
      $2::jsonb
    )
    RETURNING *
  `, [args.postId, JSON.stringify(args.raw)])
}

const deleteDocument = (_, args, context) => {
  return pg.head(`
    DELETE FROM
      documents
    WHERE
      id = $1
    RETURNING *
  `, [args.id])
}

const createProject = (_, args, context) => {
  return pg.head(`
    INSERT INTO projects(name, user_id) VALUES('${args.name}', '${context.user}') RETURNING *
  `)
}

const deleteProject = (_, args, context) => {
  return pg.head(`
    DELETE FROM projects WHERE id = '${args.id}' RETURNING *
  `)
}

const generateToken = (_, args, context) => {
  return pg.head(`
    UPDATE users
    SET secret = (SELECT gen_secret())
    WHERE id = '${context.user}'
    RETURNING *
  `)
}

const createOrigin = (_, args, context) => {
  return pg.head(`
    INSERT INTO
      origins(
        project_id,
        name,
        origin_type
      )
      VALUES(
        '${args.projectId}',
        '${args.name}',
        '${args.originType}'::origin_type
      )
    RETURNING *
  `)
}

const deleteOrigin = (_, args, context) => {
  return pg.head(`
    DELETE FROM origins
    WHERE id = '${args.id}'
    RETURNING *
  `)
}

const updateProject = (_, args, context) => {
  return pg.head(`
    UPDATE projects
    SET name = '${args.name}'
    WHERE id = '${args.id}'
    RETURNING *
  `)
}

const createTag = (_, args, context) => {
  const query = `
    WITH old_tag AS (
      SELECT * FROM tags WHERE name = '${args.name}'
    ),
    new_tag AS (
      INSERT into tags (name, project_id) SELECT '${args.name}', '${args.projectId}' WHERE (SELECT id FROM old_tag) IS NULL RETURNING *
    ),
    merged AS (
      SELECT x.* FROM old_tag x UNION SELECT y.* FROM new_tag y
    ),
    connection AS (
      INSERT INTO posts_tags(tag_id, post_id) SELECT (SELECT id FROM merged), '${args.postId}'
    )
    SELECT * FROM merged
  `
  return pg.head(query)
}

const deleteTag = (_, args, context) => {
  const query = `
    DELETE FROM posts_tags WHERE tag_id = '${args.id}'
  `
  return pg.head(query)
}

const resolvers = {
  Query: {
    user: async (parent, args, context) => {
      let data = await pg.head(`
        SELECT * FROM users WHERE id = $1
      `, [context.user])
      return data
    },
    document: async (parent, args, context) => {
      return pg.head(`
        SELECT * FROM documents WHERE id = $1
      `, [args.id])
    },
    tag: async (parent, args, context) => {
      return pg.head(`
        SELECT * FROM tags WHERE id = $1
      `, [args.id])
    },
    version: async (parent, args, { context }) => {
      return context.redis.get(args.id)
        .then(json => JSON.parse(json))
      // return pg.query(`
      //   SELECT * FROM versions WHERE id = $1
      // `, [args.id])
    },
    post: async (parent, args, context) => {
      if (args.id) {
        return pg.head(`SELECT * FROM posts WHERE id = $1::text`, [args.id])
      }

      if (args.projectId) {
        return pg.query(`
          SELECT
            posts.*
          FROM
            posts
          JOIN
            projects ON (posts.project_id = projects.id)
          WHERE
            posts.project_id = $1::text
          AND
            projects.user_id = $2::text
        `, [args.projectId, context.user])
      }

      const condition = args.slug
        ? `AND slug ILIKE '%${args.slug}%'`
        : ''

      return pg.head(`
        SELECT
          posts.*
        FROM 
          posts
        JOIN projects ON (projects.id = posts.project_id)
        WHERE projects.user_id = '${context.user}'
        ${condition}
      `)
    },
    allProjects: async (parent, args, context) => {
      return pg.query(`
        SELECT * FROM projects WHERE user_id = $1
      `, [context.user])
    },
    allTags: async (parent, args, context) => {
      return pg.query('SELECT * FROM tags WHERE project_id = $1', [args.projectId])
    },
    project: async (parent, args, context) => {
      return pg.head(`
        SELECT * FROM projects WHERE id = $1
      `, [args.id])
    },
    tagsByPost: async (parent, args, context) => {
      const query = `
      SELECT * from posts_tags
      JOIN tags ON (posts_tags.tag_id = tags.id)
      WHERE posts_tags.post_id = $1
      `
      return pg.query(query, [args.postId])
        .then(data => data || [])
    },
    feed: async (parent, args, context) => {
      const {
        limit = 10,
        offset = 0
      } = args

      const query = args.query
        ? `AND posts.title ILIKE '%${args.query}%'`
        : ''
      const project = args.projectId
        ? `AND project_id = '${args.projectId}'`
        : ''

      const str = `
        SELECT
        ARRAY(
          SELECT
            json_build_object(
              'id', posts.id,
              'createdAt', posts.created_at,
              'updatedAt', posts.updated_at,
              'projectId', posts.project_id,
              'title', posts.title,
              'slug', posts.slug,
              'status', posts.status,
              'excerpt', posts.excerpt,
              'publishedAt', posts.published_at
            )
          FROM
            posts
          JOIN
            projects ON (projects.id = posts.project_id)
          WHERE
            projects.user_id = $1::text
          ${project}
          ${query}
          ORDER BY
            posts.created_at DESC
          LIMIT $2
          OFFSET $3
        ) posts,
        (
          SELECT count(*) FROM posts
          JOIN projects ON (projects.id = posts.project_id)
          WHERE projects.user_id = $1::text
        ) count
      `
      const data = await pg.head(str, [context.user, limit, offset])
      return data
    }
  },
  Mutation: {
    createUser: createUser,
    signinUser: signinUser,
    createPost: createPost,
    deletePost: deletePost,
    createDocument: createDocument,
    updateDocument: updateDocument,
    deleteDocument: deleteDocument,
    deleteVersion: deleteVersion,
    createImage: createImage,
    deleteImage: deleteImage,
    createVersion: createVersion,
    createProject: createProject,
    generateToken: generateToken,
    updateUser: updateUser,
    createOrigin: createOrigin,
    deleteOrigin: deleteOrigin,
    updateProject: updateProject,
    updatePost: updatePost,
    deleteProject: deleteProject,
    createTag: createTag,
    deleteTag: deleteTag,
    deleteUser: deleteUser
  },
  Feed: {},
  Post: {
    document: (parent, args, context) => {
      return pg.head(`
        SELECT * FROM documents WHERE post_id = $1 
      `, [parent.id])
    },
    images: (parent, args, context) => {
      return pg.query(`
        SELECT * FROM images WHERE post_id = $1
      `, [parent.id])
    },
    project: (parent, args, context) => {
      return pg.head(`
        SELECT * FROM projects WHERE id = $1
      `, [parent.projectId])
    },
    tags: (parent, args, context) => {
      const query = `
        SELECT * from posts_tags
        JOIN tags ON (posts_tags.tag_id = tags.id)
        WHERE posts_tags.post_id = $1
      `
      console.log(query)
      return pg.query(query, [parent.id])
    }
  },
  Tag: {
    project: (parent, args, context) => {
      return pg.head(`
        SELECT * FROM projects WHERE id = $1
      `, [parent.projectId])
    }
  },
  Project: {
    posts: (parent, args, context) => {
      return pg.query(`
        SELECT * FROM posts WHERE project_id = $1
      `, [parent.id])
    },
    origins: (parent, args, context) => {
      return pg.query(`
        SELECT * FROM origins WHERE project_id = $1
      `, [parent.id])
    }
  },
  Origin: {
    project: (parent, args, context) => {
      return pg.head(`
        SELECT * FROM projects WHERE id = $1
      `, [parent.projectId])
    }
  },
  User: {
    projects: (parent, args, context) => {
      return pg.query(`
        SELECT * FROM projects WHERE user_id = $1
      `, [context.user])
    }
  },
  Document: {
    versions: async (parent, args, { context }) => {
      const values = await context.redis.keys(`${parent.id}/*`)
      console.log({ values })
      const result = await Promise.all(
        values
          .map(v => context.redis.get(v)
            .then(json => JSON.parse(json))
            .then(data => ({
              id: data.id,
              createdAt: data.created_at,
              updatedAt: data.updated_at,
              raw: data.raw,
              document: {
                id: data.document_id
              }
            }))
          )
      )
      console.log(result)
      return result
      // return pg.query(`
      //   SELECT * FROM versions WHERE document_id = $1
      // `, [parent.id])
    }
  },
  Version: {
    document: (parent, args, context) => {
      return pg.head(`
        SELECT * FROM documents WHERE id = $1
      `, [parent.documentId])
    }
  },
  JSON: GraphQLJSON
}

module.exports = resolvers
