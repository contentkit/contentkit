const g = require('graphql-request')
const AWS = require('aws-sdk')
const s3 = new AWS.S3({ region: 'us-east-1' })
const env = require('./env')
const {
  BUCKET_NAME,
  GRAPH_COOL_ENDPOINT,
  ROOT
} = env

const edge = require('lambda-edge-router')()

function makeRequest (token, query) {
  const client = new g.GraphQLClient(GRAPH_COOL_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return client.request(query)
    .then(data => data.Project)
}

function postQuery (token, projectId, slug) {
  const query = `{
    Project(id: "${projectId}") {
      posts(filter: {
        postMeta: {
          slug: "${slug}"
        }
      }) {
        id
        updatedAt
        createdAt
        project {
          id
        }
        images {
          url
          id
        }
        user {
          id
          name
          email
        }
        document {
          id
          html
        }
        postMeta {
          id
          slug
          title
          status
          date
          excerpt
        }
      }
    }
  }`

  return makeRequest(token, query)
}

function allPostsQuery (token, projectId) {
  const query = `{
    Project(id: "${projectId}") {
      posts(
        orderBy: createdAt_DESC
      ) {
        id
        updatedAt
        createdAt
        postMeta {
          id
          slug
          title
          status
          date
        }
        images {
          url
          id
        }
        user {
          name
          email
        }
      }
    }
  }`
  return makeRequest(token, query)
}

function checkAuth (request, project) {
  const { clientIp } = request
  const mutation = `
      mutation {
        validateDomain(
          project: "${project}",
          ipAddress:"${clientIp}"
        ) {
          valid
          secret
        }
      }
  `
  const client = new g.GraphQLClient(GRAPH_COOL_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${ROOT}`
    }
  })
  return client.request(mutation)
    .then(({ validateDomain }) => validateDomain)
}

edge.use('/.*', (err, handler, next) => {
  if (err) console.log(err)
  console.log(handler)
  next()
})

edge.use('/static/:postId/:file', (err, handler, next) => {
  if (err) console.log(err)
  let { postId, file } = handler.params
  let url = s3.getSignedUrl('getObject', {
    Bucket: BUCKET_NAME,
    Key: `static/${postId}/${file}`
  })
  handler.redirect(url)
})

edge.use('/api/v1/presigned/:id', (err, handler, next) => {
  if (err) console.log(err)
  let contentType = decodeURIComponent(handler.query.type)
  let id = decodeURIComponent(handler.params.id)
  s3.createPresignedPost({
    Bucket: BUCKET_NAME,
    Fields: {
      key: decodeURIComponent(id),
      'Content-Type': contentType
    }
  }, (err, data) => {
    if (err) console.log(err)
    handler.send(data)
  })
})

edge.use('/api/v1/project/:id/posts/:slug', (err, handler, next) => {
  if (err) console.log(err)
  let { slug, id } = handler.params
  let token
  let auth = handler.headers['Authorization']
  if (auth) {
    token = auth.replace(/[B|b]earer\s?/, '')
  }

  if (token) {
    postQuery(token, id, slug).then(data => {
      handler.send(data)
    })
  } else {
    checkAuth(handler.request, id)
      .then(({ valid, secret }) => {
        if (valid) {
          postQuery(secret, id, slug).then(data => {
            handler.send(data)
          })
        } else {
          handler.error('unauthorized')
        }
      })
  }
})

edge.use('/api/v1/project/:id', (err, handler, next) => {
  if (err) console.log(err)
  let { id } = handler.params
  let token
  let auth = handler.headers['Authorization']
  if (auth) {
    token = auth.replace(/[B|b]earer\s?/, '')
  }
  if (token) {
    allPostsQuery(token, id).then(data => {
      handler.send(data)
    })
  } else {
    checkAuth(handler.request, id)
      .then(({ valid, secret }) => {
        if (valid) {
          allPostsQuery(secret, id).then(data => {
            handler.send(data)
          })
        } else {
          handler.error('unauthorized')
        }
      })
  }
})

exports.response = function (event, context, callback) {
  return edge.handle(event, context, callback)
}
