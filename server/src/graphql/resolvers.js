const client = require('postgres-tools')
const GraphQLJSON = require('graphql-type-json')
// const diffpatch = require('jsondiffpatch')
// const crypto = require('crypto')
const snakeCase = require('lodash.snakecase')

async function createUser (_, { id, email, password }) {
  let user = await client.query(`
    INSERT INTO users(role, email, password)
    SELECT 'ADMIN', '${email}', crypt('${password}', gen_salt('bf'))
    WHERE NOT EXISTS(
      SELECT * FROM users WHERE email = '${email}'
    )
    RETURNING *
  `, {
    head: true
  })
  if (user) {
    // await sendUserConfirmationEmail(user).catch(err => {
    //  console.log(err)
    // })
    return user
  } else {
    throw new Error('User exists')
  }
}

async function signinUser (_, { email, password }) {
  const query = `
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
  `
  let user = await client.query(query, {
    head: true
  }).catch(err => {
    console.log(err)
  })
  if (user) {
    return user
  }
}

const updateUser = (_, args, context) => {
  return client.query(`
    UPDATE
      users
    SET
      email = '${args.email}',
      name = '${args.name}'
    WHERE id = '${context.user}'
    RETURNING *
  `, { head: true })
}

const createPost = (_, { title, projectId }, context) => {
  return client.query(`
    insert into posts(
      user_id,
      project_id,
      title
    )
    values('${context.user}', '${projectId}', '${title}') RETURNING *
  `, { head: true })
}

const updateDocument = async (_, { id, raw, html }) => {
  //let document = await client.query(`
  //  SELECT * FROM documents WHERE id = '${id}'
  //`, { head: true })

  //let delta = diffpatch.diff(document.raw, raw)
  //console.log(delta)
  return client.query(`
    UPDATE documents set raw = '${JSON.stringify(raw)}'::jsonb, html = '${html}'
    WHERE id = '${id}' returning *
  `, { head: true })
}

const deleteVersion = (_, { id }) => {
  return client.query(`
    DELETE FROM versions WHERE id = '${id}' RETURNING *
  `)
}

const updatePostMeta = (parent, args, context) => {
  const publishedAt = args.publishedAt || new Date().toISOString()
  const status = args.status || 'DRAFT'

  return client.query(`
    UPDATE
      posts
    SET
      title = '${args.title}',
      published_at = '${publishedAt}'::timestamp,
      status = '${status}'::post_status
    WHERE id = '${args.id}'
    RETURNING *
  `, { head: true })
}

const updatePost = (parent, args, context) => {
  args.status = args.status || 'DRAFT'
  let { id, ...rest } = args

  let params = Object.keys(rest).reduce((acc, key) => {
    let type = key === 'publishedAt'
      ? 'timestamp'
      : key === 'status'
        ? 'post_status'
        : 'text'
    acc.push(`SET ${snakeCase(key)} = '${rest[key]}'::${type}`)
    return acc
  }, [])
  return client.query(`
    UPDATE
      posts
    SET
      ${params.join('\n')}
    WHERE id = '${args.id}'
    RETURNING *
  `, { head: true })
}

const updatePostProject = async (parent, args, context) => {
  const query = `
    UPDATE posts
    SET project_id = '${args.projectId}'
    WHERE id = '${args.id}'
    RETURNING *
  `
  return client.query(query, { head: true })
}

const createImage = (_, args, context) => {
  return client.query(`
    INSERT INTO images(post_id, url)
    VALUES(
      '${args.postId}',
      '${args.url}'
    )
    RETURNING *
  `, { head: true })
}

const deleteImage = (_, args, context) => {
  return client.query(`
    DELETE FROM images
    WHERE id = '${args.id}'
    RETURNING *
  `, { head: true })
}

const createVersion = (_, args, context) => {
  return client.query(`
    INSERT INTO versions(raw, document_id)
    VALUES(
      '${JSON.stringify(args.raw)}',
      '${args.documentId}'
    )
    RETURNING *
  `, { head: true })
}

const deletePost = (_, args, context) => {
  return client.query(`
    DELETE FROM posts WHERE id = '${args.id}' RETURNING *
  `, { head: true })
}

const createDocument = (_, args, context) => {
  return client.query(`
    INSERT INTO document(raw, post_id)
    VALUES(
      '${JSON.stringify(args.raw)}'::jsonb,
      '${args.postId}'::text
    )
    RETURNING *
  `, { head: true })
}

const deleteDocument = (_, args, context) => {
  return client.query(`
    DELETE FROM documents WHERE id = '${args.id}' RETURNING *
  `, { head: true })
}

const createProject = (_, args, context) => {
  return client.query(`
    INSERT INTO projects(name, user_id) VALUES('${args.name}', '${context.user}') RETURNING *
  `, { head: true })
}

const generateToken = (_, args, context) => { 
  return client.query(`
    UPDATE users
    SET secret = generate_uid(25)
    WHERE id = '${context.user}'
    RETURNING *
  `, { head: true })
}

const createOrigin = (_, args, context) => {
  return client.query(`
    INSERT INTO
      origins(
        name,
        project_id,
        origin_type
      )
      VALUES(
        '${args.name}',
        '${args.projectId}',
        '${args.originType}'::origin_type
      )
    RETURNING *
  `, { head: true })
}

const deleteOrigin = (_, args, context) => {
  return client.query(`
    DELETE FROM origins WHERE id = '${args.id}'
    RETURNING *
  `, { head: true })
}

const updateProject = (_, args, context) => {
  return client.query(`
    UPDATE projects
    SET name = '${args.name}'
    WHERE id = '${args.id}'
    RETURNING *
  `, { head: true })
}

const resolvers = {
  Query: {
    user: async (parent, args, context) => {
      let data = await client.query(`
        SELECT * FROM users WHERE id = '${context.user}'
      `, {
        head: true
      })
      return data
    },
    document: async (parent, args, context) => {
      return client.query(`
        SELECT * FROM documents WHERE id = '${args.id}'
      `, {
        head: true
      })
    },
    allDocuments: async (parent, args, context) => {
      return client.query(`
        SELECT * FROM documents
      `)
    },
    version: async (parent, args, context) => {
      return client.query(`
        SELECT * FROM versions WHERE id = '${args.id}'
      `)
    },
    allVersions: async (parent, args, context) => {
      return client.query(`
        SELECT * FROM versions
      `)
    },
    allPosts: async (parent, args, context) => {
      let limit = args.limit || 10
      let offset = args.offset || 0
      let query = args.query
        ? `AND posts.title ILIKE '%${args.query}%'`
        : ''
      let project = args.projectId
        ? `AND project_id = '${args.projectId}'`
        : ''

      return client.query(`
        SELECT *
        FROM posts
        WHERE user_id = '${context.user}' ${project} ${query}
        ORDER BY posts.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `)
    },
    post: async (parent, args, context) => {
      return client.query(`
        SELECT *
        FROM posts
        WHERE id = '${args.id}'
      `, { head: true })
    },
    allProjects: async (parent, args, context) => {
      return client.query(`
        SELECT * FROM projects WHERE user_id = '${context.user}'
      `)
    },
    project: async (parent, args, context) => {
      return client.query(`
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
     
      let data = await client.query(`
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
      console.log(data)
      return data
    }
  },
  Mutation: {
    createUser: createUser,
    signinUser: signinUser,
    createPost: createPost,
    updatePostMeta: updatePostMeta,
    updatePostProject: updatePostProject,
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
    updatePost: updatePost
  },
  Feed: {},
  Post: {
    document: (parent, args, context) => {
      console.log(parent)
      return client.query(`
        SELECT * FROM documents WHERE post_id = '${parent.id}'
      `, { head: true })
    },
    postMeta: (parent, args, context) => {
      console.log(parent)
      return client.query(`
        SELECT * FROM postmeta WHERE post_id = '${parent.id}'
      `, { head: true })
    },
    images: (parent, args, context) => {
      console.log(parent)
      return client.query(`
        SELECT * FROM images WHERE post_id = '${parent.id}'
      `)
    },
    project: (parent, args, context) => {
      console.log(parent)
      return client.query(`
        SELECT * FROM projects WHERE id = '${parent.projectId}'
      `, { head: true })
    }
  },
  Project: {
    posts: (parent, args, context) => {
      return client.query(`
        SELECT * FROM posts WHERE project_id = '${parent.id}'
      `)
    },
    origins: (parent, args, context) => {
      return client.query(`
        SELECT * FROM origins
        WHERE project_id = '${parent.id}'
      `)
    }
  },
  Origin: {
    project: (parent, args, context) => {
      return client.query(`
        SELECT * FROM projects WHERE id = '${parent.projectId}'
      `, { head: true })
    }
  },
  User: {
    projects: (parent, args, context) => {
      return client.query(`
        SELECT * FROM projects WHERE user_id = '${context.user}'
      `)
    }
  },
  Document: {
    versions: (parent, args, context) => {
      return client.query(`
        SELECT * FROM versions WHERE document_id = '${parent.id}'
      `)
    }
  },
  Version: {
    document: (parent, args, context) => {
      return client.query(`
        SELECT * FROM documents WHERE id = '${parent.documentId}'
      `, { head: true })
    }
  },
  JSON: GraphQLJSON
}

module.exports = resolvers
