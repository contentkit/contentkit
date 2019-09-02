const GraphQLJSON = require('graphql-type-json')
const snakeCase = require('lodash.snakecase')
const pg = require('postgres-tools')
const statements = require('./statements')
const randomBytes = require('crypto').randomBytes

const { AuthenticationError, ValidationError } = require('apollo-server-lambda')

async function createUser (_, args, ctx) {
  const { email, password } = args
  const user = await pg.head(statements.Mutation.createUser, [email, password])
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
  return pg.head(statements.Mutation.updateUser, [args.email, args.name, ctx.user])
}

const deleteUser = (_, args, ctx) => {
  return pg.head(statements.Mutation.deleteUser, [ctx.user])
}

const createPost = (_, { title, projectId }, ctx) => {
  return pg.head(statements.Mutation.createPost, [projectId, title])
}

const updateDocument = async (_, { id, raw, encodedHtml }, ctx) => {
  raw.blocks = raw.blocks
    .map(block => {
      if (block.text) {
        block.text = block.text.replace(/'/g, `''`)
      }
      return block
    })

  const versionId = randomBytes(8).toString('hex')
  await ctx.context.redis.set(
    `${id}/${versionId}`,
    JSON.stringify({
      user: ctx.user,
      postId: id,
      id: versionId,
      raw: raw,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
  )

  return pg.head(statements.Mutation.updateDocument, [JSON.stringify(raw), encodedHtml, id])
}

const deleteVersion = (_, { id }, ctx) => {
  ctx.context.redis.del(id)
  return {
    id
  }
}

const updatePost = (parent, args, ctx) => {
  args.status = args.status || 'DRAFT'
  args.coverImageId = args.coverImageId || 'NULL'

  return pg.head(statements.Mutation.updatePost, [
    args.excerpt,
    args.projectId,
    args.publishedAt,
    args.status,
    args.title,
    args.coverImageId
  ])
}

const createImage = (_, args, ctx) => {
  return pg.head(statements.Mutation.createImage, [args.postId, args.url])
}

const deleteImage = (_, args, ctx) => {
  return pg.head(statements.Mutation.deleteImage, [args.id])
}

const createVersion = (_, args, ctx) => {
  const versionId = randomBytes(8).toString('hex')
  return ctx.context.redis.set(
    `${args.postId}/${versionId}`,
    JSON.stringify({
      user: ctx.user,
      postId: args.postId,
      id: versionId,
      raw: args.raw
    })
  )
}

const deletePost = (_, args, ctx) => {
  return pg.head(statements.Mutation.deletePost, [args.id])
}

const createProject = (_, args, context) => {
  return pg.head(statements.Mutation.createProject, [args.name, context.user])
}

const deleteProject = (_, args, context) => {
  return pg.head(statements.Mutation.deleteProject, [args.id])
}

const generateToken = (_, args, context) => {
  return pg.head(statements.Mutation.generateToken, [context.user])
}

const createOrigin = (_, args, context) => {
  return pg.head(statements.Mutation.createOrigin, [
    args.projectId,
    args.name,
    args.originType
  ])
}

const deleteOrigin = (_, args, context) => {
  return pg.head(statements.Mutation.deleteOrigin, [args.id])
}

const updateProject = (_, args, context) => {
  return pg.head(statements.Mutation.updateProject, [args.name, args.id])
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
  return pg.head(statements.Mutation.deleteTag, [args.id])
}

const resolvers = {
  Query: {
    user (parent, args, context) {
      return pg.head(statements.Query.user, [context.user])
    },
    tag (parent, args, context) {
      return pg.head(statements.Query.tag, [args.id])
    },
    version: async (parent, args, { context }) => {
      return context.redis.get(args.id)
        .then(json => JSON.parse(json))
    },
    post (parent, args, context) {
      if (args.id) {
        return pg.head(`SELECT * FROM posts WHERE id = $1::text`, [args.id])
      }

      const condition = args.slug
        ? `AND posts.slug ILIKE '%${args.slug}%'`
        : ''

      return pg.head(`
        SELECT
          posts.*
        FROM
          posts
        JOIN
          projects ON (projects.id = posts.project_id)
        WHERE
          posts.project_id = $1::text
        AND
          projects.user_id = $2::text
        ${condition}
      `, [args.projectId, context.user])
    },
    allProjects: async (parent, args, context) => {
      return pg.query(statements.Query.allProjects, [context.user])
    },
    allTags (parent, args, context) {
      return pg.query(statements.Query.allTags, [args.projectId])
    },
    project (parent, args, context) {
      return pg.head(statements.Query.project, [args.id])
    },
    tagsByPost (parent, args, context) {
      return pg.query(statements.Query.tagsByPost, [args.postId])
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
              'publishedAt', posts.published_at,
              'coverImage', json_build_object(
                'url', images.url,
                'id', images.id
              )
            )
          FROM posts
          JOIN projects ON (projects.id = posts.project_id)
          LEFT OUTER JOIN images ON (images.id = posts.cover_image_id)
          WHERE projects.user_id = $1::text
          AND project_id = $2::text
          ${query}
          ORDER BY posts.created_at DESC
          LIMIT $3
          OFFSET $4
        ) posts,
        (
          SELECT count(*) FROM posts WHERE posts.project_id = $2::text
          ${query}
        ) count
      `
      console.log(str)
      const data = await pg.head(str, [context.user, args.projectId, limit, offset])
      return data
    }
  },
  Mutation: {
    createUser: createUser,
    signinUser: signinUser,
    createPost: createPost,
    deletePost: deletePost,
    updateDocument: updateDocument,
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
    versions: async (parent, args, { context }) => {
      const values = await context.redis.keys(`${parent.id}/*`)
      const result = await Promise.all(
        values
          .map(v => context.redis.get(v)
            .then(json => JSON.parse(json))
            .then(data => ({
              id: data.id,
              createdAt: data.created_at,
              updatedAt: data.updated_at,
              raw: data.raw,
              postId: data.postId
            }))
          )
      )
      return result
    },
    images: (parent, args, context) => {
      return pg.query(statements.Post.images, [parent.id])
    },
    coverImage: (parent, args, context) => {
      if (parent.coverImage) {
        return parent.coverImage
      }
      if (!parent.coverImageId) {
        return null
      }
      return pg.head(statements.Post.coverImage, [parent.coverImageId])
    },
    project (parent, args, context) {
      return pg.head(statements.Post.project, [parent.projectId])
    },
    tags (parent, args, context) {
      return pg.query(statements.Post.tags, [parent.id])
    }
  },
  Tag: {
    project: (parent, args, context) => {
      return pg.head(statements.Tag.project, [parent.projectId])
    }
  },
  Project: {
    posts: (parent, args, context) => {
      return pg.query(statements.Project.posts, [parent.id])
    },
    origins: (parent, args, context) => {
      return pg.query(statements.Project.origins, [parent.id])
    }
  },
  Origin: {
    project (parent, args, context) {
      return pg.head(statements.Origin.project, [parent.projectId])
    }
  },
  User: {
    projects (parent, args, context) {
      return pg.query(statements.User.projects, [context.user])
    }
  },
  Version: {

  },
  JSON: GraphQLJSON
}

module.exports = resolvers
