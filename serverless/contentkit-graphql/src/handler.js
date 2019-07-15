const { ApolloServer } = require('apollo-server-lambda')
const fs = require('fs')
const path = require('path')
const redis = require('redis')
const pg = require('postgres-tools')
const promisify = require('util').promisify

const JWS_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/

const resolvers = require('./resolvers')
const typeDefs = fs.readFileSync(path.join(__dirname, './schema.graphql'), { encoding: 'utf8' })

const context = async (ctx) => {
  ctx.context.callbackWaitsForEmptyEventLoop = false
  const auth = ctx.event.headers.Authorization
  const token = auth && auth.replace(/\s*[Bb]earer\s/, '')
  if (!token) return ctx

  const isToken = JWS_REGEX.test(token)
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

function handler (event, context, callback) {
  const client = redis.createClient(process.env.REDIS_CONNECTION_STRING)
  context.redis = {}
  context.redis.set = promisify(client.set.bind(client))
  context.redis.get = promisify(client.get.bind(client))
  context.redis.keys = promisify(client.keys.bind(client))
  context.redis.del = client.del.bind(client)
  context.redis.keys = promisify(client.keys.bind(client))

  const callbackFilter = (err, resp) => {
    client.quit(() => {
      callback(err, resp)
    })
  }

  server.createHandler({
    cors: {
      origin: '*',
      credentials: true,
      allowedHeaders: '*'
    }
  })(event, context, callbackFilter)
}

module.exports.handler = handler
