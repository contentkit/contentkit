const path = require('path')
require('dotenv').config()
const { ApolloServer, makeExecutableSchema } = require('apollo-server-express')
const fs = require('fs')
const resolvers = require('./resolvers')
const typeDefs = fs.readFileSync(path.join(__dirname, './schema.graphql'), { encoding: 'utf8' })

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})
const client = require('postgres-tools')

const server = new ApolloServer({
  schema,
  context: async (context) => {
    let auth = context.req.headers.authorization
    let token = auth && auth.replace(/\s*[Bb]earer\s/, '')

    if (token) {
      let sub = (token && JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf8')).sub) || ''
      let q = `
        SELECT
          x.*,
          to_timestamp((select x.payload::json->>'exp')::int) AS exp
        FROM verify(
          '${token}',
          (SELECT password FROM users WHERE id = '${sub}')
        ) x
      `
      console.log(q)
      let result = await client.query(q, { head: true })
      console.log({ result })
      context.user = result.valid ? sub : null
    }
    return context
  }
})

module.exports = server
