const client = require('postgres-tools')

function postQuery (projectId, slug) {
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

module.exports.handler = async (event, context, callback) => {
  

}