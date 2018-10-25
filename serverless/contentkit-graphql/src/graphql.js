const { ApolloServer } = require('apollo-server-lambda')
const schema = require('./schema')
const pg = require('postgres-tools')
const JWS_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/

const context = async (ctx) => {
  ctx.context.callbackWaitsForEmptyEventLoop = false
  let auth = ctx.event.headers.Authorization
  let token = auth && auth.replace(/\s*[Bb]earer\s/, '')
  if (!token) return ctx

  let isToken = JWS_REGEX.test(token)
  if (isToken) {
    let sub = (token && JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf8')).sub) || ''
    let result = await pg.query(`
      SELECT
        x.*,
        to_timestamp((select x.payload::json->>'exp')::int) AS exp
      FROM verify(
        '${token}',
        (SELECT password FROM users WHERE id = '${sub}')
      ) x
    `, { head: true })
    ctx.user = result.valid ? sub : null
  } else {
    let user = await pg.query(`
      SELECT * FROM users WHERE secret = '${token}'
    `, { head: true })
    if (user) {
      ctx.user = user.id
    }
  }
  return ctx
}

const server = new ApolloServer({
  schema,
  context
})

module.exports = server
