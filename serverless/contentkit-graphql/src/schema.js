const fs = require('fs')
const path = require('path')
const { makeExecutableSchema } = require('apollo-server-lambda')
const resolvers = require('./resolvers')
const typeDefs = fs.readFileSync(path.join(__dirname, './schema.graphql'), { encoding: 'utf8' })

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

console.log(JSON.stringify(schema))
module.exports = schema
