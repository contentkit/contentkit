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
      let result = await client.query(`
        SELECT * FROM verify('${token}', (SELECT password FROM users WHERE id = '${sub}'))
      `, { head: true })
      console.log({ result })
      context.user = result && result.payload.exp > (Date.now() / 1000)
        ? sub
        : null
    }
    return context
  }
})

module.exports = server
