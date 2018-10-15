const g = require('graphql-request')
const client = require('postgres-tools')
const dns = require('dns')

const lookup = (ipAddress) => new Promise((resolve, reject) => {
  dns.reverse(ipAddress, (err, hostnames) => {
    if (err) reject(err)
    else resolve(hostnames || [])
  })
})

// function makeRequest (token, query) {
//  const client = new g.GraphQLClient(GRAPH_COOL_ENDPOINT, {
//    headers: {
//      Authorization: `Bearer ${token}`
//    }
//  })
//  return client.request(query)
//    .then(data => data.Project)
// }

function postQuery (token, projectId, slug) {
  return client.query(`
    SELECT
      posts.*,
      JSON_BUILD_OBJECT(
        'html', documents.html
      ) as document,
      JSON_BUILD_OBJECT(
        'email', users.email,
        'name', users.name
      ) as user,
      JSON_BUILD_OBJECT(
        'url', images.url,
        'id', images.id
      ) as images
    FROM
      posts
    JOIN
      documents ON (documents.post_id = posts.id)
    JOIN
      users ON (users.id = posts.user_id)
    JOIN
      images ON (images.post_id = posts.id)
    WHERE project_id = '${projectId}'
    AND slug = '${slug}'
    ORDER BY created_at DESC
  `, { head: true })
}

function allPostsQuery (token, projectId) {
  return client.query(`
    SELECT
      posts.*,
      JSON_BUILD_OBJECT(
        'email', users.email,
        'name', users.name
      ) as user,
      JSON_BUILD_OBJECT(
        'url', images.url,
        'id', images.id
      ) as images
    FROM
      posts
    JOIN
      users ON (users.id = posts.user_id)
    JOIN
      images ON (images.post_id = posts.id)
    WHERE project_id = '${projectId}'
    ORDER BY created_at DESC
  `)
}

async function checkAuth ({ clientIp }, project) {
  let data = await client.query(`
    SELECT
      users.secret as secret
    FROM
      projects
    JOIN origins ON(
      origins.project_id = projects.id AND origins.name = '${clientIp}'
    )
    JOIN users ON(users.id = projects.user_id)
    WHERE projects.id = '${project}'
  `, { head: true })
  return {
    valid: Boolean(data.secret),
    secret: data.secret
  }
}

module.exports = {
  checkAuth,
  allPostsQuery,
  postQuery
}