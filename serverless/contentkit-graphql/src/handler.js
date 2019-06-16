const { ApolloServer } = require('apollo-server-lambda')
const fs = require('fs')
const path = require('path')

const pg = require('postgres-tools')
const JWS_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/

const resolvers = require('./resolvers')
const typeDefs = fs.readFileSync(path.join(__dirname, './schema.graphql'), { encoding: 'utf8' })

const context = async (ctx) => {
  ctx.context.callbackWaitsForEmptyEventLoop = false
  let auth = ctx.event.headers.Authorization
  let token = auth && auth.replace(/\s*[Bb]earer\s/, '')
  if (!token) return ctx

  let isToken = JWS_REGEX.test(token)
  if (isToken) {
    let sub = (token && JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf8')).sub) || ''
    let result = await pg.head(`
      SELECT
        x.*,
        to_timestamp((select x.payload::json->>'exp')::int) AS exp
      FROM verify(
        '${token}',
        (SELECT password FROM users WHERE id = '${sub}')
      ) x
    `)
    ctx.user = result.valid ? sub : null
  } else {
    let user = await pg.head('SELECT * FROM users WHERE secret = $1', [token])
    if (user) {
      ctx.user = user.id
    }
  }
  return ctx
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context
})

module.exports.handler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
    allowedHeaders: '*'
  }
})
