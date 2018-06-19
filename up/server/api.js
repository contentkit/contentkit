const g = require('graphql-request')
const {
  GRAPH_COOL_ENDPOINT,
  ROOT_TOKEN
} = process.env

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

function checkAuth ({ clientIp }, project) {
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
      Authorization: `Bearer ${ROOT_TOKEN}`
    }
  })
  return client.request(mutation)
    .then(({ validateDomain }) => validateDomain)
}

module.exports = {
  makeRequest,
  checkAuth,
  allPostsQuery,
  postQuery
}
