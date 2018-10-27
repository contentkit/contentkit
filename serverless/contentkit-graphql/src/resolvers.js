const GraphQLJSON = require('graphql-type-json')
const snakeCase = require('lodash.snakecase')
const pg = require('postgres-tools')
const { AuthenticationError, ValidationError } = require('apollo-server-lambda')

async function createUser (_, args, ctx) {
  let { email, password } = args
  let user = await pg.query(`
    INSERT INTO users(email, password)
    VALUES(
      '${email}',
      '${password}'
    )
    WHERE NOT EXISTS(
      SELECT * FROM users WHERE email = '${email}'
    )
    RETURNING *
  `, {
    head: true
  })
  if (user) {
    return user
  } else {
    throw new ValidationError('User exists')
  }
}

async function signinUser (_, { email, password }, ctx) {
  let user = await pg.query(`
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
    email = '${email}'
  AND
    password = crypt('${password}', password);
  `, {
    head: true
  }).catch(err => {
    throw new AuthenticationError(err)
  })
  if (user) {
    return user
  } else {
    throw new AuthenticationError('Could not login with provided credentials')
  }
}

const updateUser = (_, args, ctx) => {
  return pg.query(`
    UPDATE
      users
    SET
      email = '${args.email}',
      name = '${args.name}'
    WHERE id = '${ctx.user}'
    RETURNING *
  `, { head: true })
}

const createPost = (_, { title, projectId }, ctx) => {
  return pg.query(`
    insert into posts(
      user_id,
      project_id,
      title
    )
    values('${ctx.user}', '${projectId}', '${title}') RETURNING *
  `, { head: true })
}

const updateDocument = async (_, { id, raw, html }, ctx) => {
  // let document = await client.query(`
  //  SELECT * FROM documents WHERE id = '${id}'
  // `, { head: true })

  // let delta = diffpatch.diff(document.raw, raw)
  // console.log(delta)
  return pg.query(`
    UPDATE documents set raw = '${JSON.stringify(raw)}'::jsonb, html = '${html}'
    WHERE id = '${id}' returning *
  `, { head: true })
}

const deleteVersion = (_, { id }, ctx) => {
  return pg.query(`
    DELETE FROM versions WHERE id = '${id}' RETURNING *
  `)
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

  return pg.query(`
    UPDATE
      posts
    SET
      ${params.join(', ')}
    WHERE id = '${args.id}'
    RETURNING *
  `, { head: true })
}

const createImage = (_, args, ctx) => {
  return pg.query(`
    INSERT INTO images(user_id, post_id, url)
    VALUES(
      '${ctx.user}',
      '${args.postId}',
      '${args.url}'
    )
    RETURNING *
  `, { head: true })
}

const deleteImage = (_, args, ctx) => {
  return pg.query(`
    DELETE FROM images
    WHERE id = '${args.id}'
    AND user_id = '${ctx.user}'
    RETURNING *
  `, { head: true })
}

const createVersion = (_, args, ctx) => {
  return pg.query(`
    INSERT INTO versions(user_id, document_id, raw)
    VALUES(
      '${ctx.user}',
      '${args.documentId}',
      '${JSON.stringify(args.raw)}'
    )
    RETURNING *
  `, { head: true })
}

const deletePost = (_, args, ctx) => {
  return pg.query(`
    DELETE FROM posts WHERE id = '${args.id}' RETURNING *
  `, { head: true })
}

const createDocument = (_, args, context) => {
  return pg.query(`
    INSERT INTO document(user_id, post_id, raw)
    VALUES(
      '${context.user}',
      '${args.postId}'::text,
      '${JSON.stringify(args.raw)}'::jsonb
    )
    RETURNING *
  `, { head: true })
}

const deleteDocument = (_, args, context) => {
  return pg.query(`
    DELETE FROM
      documents
    WHERE
      id = '${args.id}'
    AND
      user_id = '${context.user}'
    RETURNING *
  `, { head: true })
}

const createProject = (_, args, context) => {
  return pg.query(`
    INSERT INTO projects(name, user_id) VALUES('${args.name}', '${context.user}') RETURNING *
  `, { head: true })
}

const deleteProject = (_, args, context) => {
  return pg.query(`
    DELETE FROM projects WHERE id = '${args.id}' RETURNING *
  `, { head: true })
}

const generateToken = (_, args, context) => {
  return pg.query(`
    UPDATE users
    SET secret = (SELECT gen_secret())
    WHERE id = '${context.user}'
    RETURNING *
  `, { head: true }).catch(err => {
    console.log(err)
    return null
  })
}

const createOrigin = (_, args, context) => {
  return pg.query(`
    INSERT INTO
      origins(
        user_id,
        project_id,
        name,
        origin_type
      )
      VALUES(
        '${context.user}',
        '${args.projectId}',
        '${args.name}',
        '${args.originType}'::origin_type
      )
    RETURNING *
  `, { head: true })
}

const deleteOrigin = (_, args, context) => {
  return pg.query(`
    DELETE FROM origins
    WHERE id = '${args.id}'
    RETURNING *
  `, { head: true })
}

const updateProject = (_, args, context) => {
  return pg.query(`
    UPDATE projects
    SET name = '${args.name}'
    WHERE id = '${args.id}'
    RETURNING *
  `, { head: true })
}

const resolvers = {
  Query: {
    user: async (parent, args, context) => {
      let data = await pg.query(`
        SELECT * FROM users WHERE id = '${context.user}'
      `, {
        head: true
      })
      return data
    },
    document: async (parent, args, context) => {
      return pg.query(`
        SELECT * FROM documents WHERE id = '${args.id}'
      `, {
        head: true
      })
    },
    version: async (parent, args, context) => {
      return pg.query(`
        SELECT * FROM versions WHERE id = '${args.id}'
      `)
    },
    post: async (parent, args, context) => {
      let condition = args.id
        ? `AND id = '${args.id}'`
        : `AND slug ILIKE '%${args.slug}%'`
      let filterByProject = args.projectId
        ? `AND project_id = '${args.projectId}'`
        : ''
      return pg.query(`
        SELECT
          posts.*
        FROM posts
        WHERE user_id = '${context.user}'
        ${condition}
        ${filterByProject}
      `, { head: true })
    },
    allProjects: async (parent, args, context) => {
      return pg.query(`
        SELECT * FROM projects WHERE user_id = '${context.user}'
      `)
    },
    project: async (parent, args, context) => {
      return pg.query(`
        SELECT * FROM projects WHERE id = '${args.id}'
      `, { head: true })
    },
    feed: async (parent, args, context) => {
      let limit = args.limit || 10
      let offset = args.offset || 0
      let query = args.query
        ? `AND posts.title ILIKE '%${args.query}%'`
        : ''
      let project = args.projectId
        ? `AND project_id = '${args.projectId}'`
        : ''

      let data = await pg.query(`
        SELECT
        ARRAY(
          SELECT
            json_build_object(
              'id', posts.id,
              'createdAt', posts.created_at,
              'updatedAt', posts.updated_at,
              'projectId', posts.project_id,
              'userId', posts.user_id,
              'title', posts.title,
              'slug', posts.slug,
              'status', posts.status,
              'excerpt', posts.excerpt,
              'publishedAt', posts.published_at
            )
          FROM
            posts
          WHERE
            user_id = '${context.user}' ${project} ${query}
          ORDER BY
            posts.created_at DESC
          LIMIT ${limit}
          OFFSET ${offset}
        ) posts,
        (SELECT count(*) FROM posts) count
      `, { head: true })
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
    deleteProject: deleteProject
  },
  Feed: {},
  Post: {
    document: (parent, args, context) => {
      return pg.query(`
        SELECT * FROM documents WHERE post_id = '${parent.id}'
      `, { head: true })
    },
    images: (parent, args, context) => {
      return pg.query(`
        SELECT * FROM images WHERE post_id = '${parent.id}'
      `)
    },
    project: (parent, args, context) => {
      return pg.query(`
        SELECT * FROM projects WHERE id = '${parent.projectId}'
      `, { head: true })
    }
  },
  Project: {
    posts: (parent, args, context) => {
      return pg.query(`
        SELECT * FROM posts WHERE project_id = '${parent.id}'
      `)
    },
    origins: (parent, args, context) => {
      return pg.query(`
        SELECT * FROM origins
        WHERE project_id = '${parent.id}'
      `)
    }
  },
  Origin: {
    project: (parent, args, context) => {
      return pg.query(`
        SELECT * FROM projects WHERE id = '${parent.projectId}'
      `, { head: true })
    }
  },
  User: {
    projects: (parent, args, context) => {
      return pg.query(`
        SELECT * FROM projects WHERE user_id = '${context.user}'
      `)
    }
  },
  Document: {
    versions: (parent, args, context) => {
      return pg.query(`
        SELECT * FROM versions WHERE document_id = '${parent.id}'
      `)
    }
  },
  Version: {
    document: (parent, args, context) => {
      return pg.query(`
        SELECT * FROM documents WHERE id = '${parent.documentId}'
      `, { head: true })
    }
  },
  JSON: GraphQLJSON
}

module.exports = resolvers
