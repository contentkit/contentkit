import { makeExecutableSchema } from 'graphql-tools'
import resolvers from './resolvers'
import { constraintDirective, constraintDirectiveTypeDefs } from 'graphql-constraint-directive'
import typeDefs from './typeDefs'

const schema = makeExecutableSchema({
  resolvers,
  typeDefs: [constraintDirectiveTypeDefs, typeDefs],
  schemaTransforms: [constraintDirective()]
})

export default schema

