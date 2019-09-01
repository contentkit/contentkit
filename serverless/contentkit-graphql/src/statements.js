module.exports = {
  Query: {
    user: 'SELECT * FROM users WHERE id = $1',
    tag: 'SELECT * FROM tags WHERE id = $1',
    allProjects: 'SELECT * FROM projects WHERE user_id = $1',
    allTags: 'SELECT * FROM tags WHERE project_id = $1',
    project: 'SELECT * FROM projects WHERE id = $1',
    tagsByPost: 'SELECT * from posts_tags JOIN tags ON (posts_tags.tag_id = tags.id) WHERE posts_tags.post_id = $1'
  },
  Mutation: {
    deleteUser: 'DELETE FROM users WHERE id = $1::text RETURNING *',
    createPost: 'insert into posts(project_id, title) values($1, $2) RETURNING *',
    updateDocument: 'UPDATE posts SET raw = $1::jsonb, encoded_html = $2::text WHERE id = $3 RETURNING *',
    updatePost: 'UPDATE posts SET excerpt = $1::text, project_id = $2::text, published_at = $3::timestamp, status = $4::post_status, title = $5::text, cover_image_id = $6 WHERE id = $7 RETURNING *',
    createUser: 'INSERT INTO users(email, password) SELECT $1, $2 WHERE NOT EXISTS (SELECT * FROM users WHERE email = $1) RETURNING *',
    updateUser: 'UPDATE users SET email = $1::text, name = $2::text WHERE id = $3 RETURNING *',
    deleteImage: 'DELETE FROM images WHERE id = $1 RETURNING *',
    deletePost: 'DELETE FROM posts WHERE id = $1 RETURNING *',
    createProject: 'INSERT INTO projects(name, user_id) VALUES($1, $2) RETURNING *',
    deleteProject: 'DELETE FROM projects WHERE id = $1 RETURNING *',
    generateToken: 'UPDATE users SET secret = (SELECT gen_secret()) WHERE id = $1 RETURNING *',
    createOrigin: 'INSERT INTO origins(project_id, name, origin_type) VALUES($1, $2, $3::origin_type) RETURNING *',
    deleteOrigin: 'DELETE FROM origins WHERE id = $1 RETURNING *',
    updateProject: 'UPDATE projects SET name = $1 WHERE id = $2 RETURNING *',
    deleteTag: 'DELETE FROM posts_tags WHERE tag_id = $1',
    createImage: 'INSERT INTO images(post_id, url) VALUES($1, $2) RETURNING *'
  },
  Post: {
    images: 'SELECT * FROM images WHERE post_id = $1',
    project: 'SELECT * FROM projects WHERE id = $1',
    tags: 'SELECT * from posts_tags JOIN tags ON (tags.id = posts_tags.tag_id) WHERE posts_tags.post_id = $1',
    coverImage: 'SELECT * FROM images WHERE id = $1'
  },
  Tag: {
    project: 'SELECT * FROM projects WHERE id = $1'
  },
  Project: {
    posts: 'SELECT * FROM posts WHERE project_id = $1',
    origins: 'SELECT * FROM origins WHERE project_id = $1'
  },
  Origin: {
    project: 'SELECT * FROM projects WHERE id = $1'
  },
  User: {
    projects: 'SELECT * FROM projects WHERE user_id = $1'
  }
}
