import gql from 'graphql-tag'

const typeDefs = gql`
  scalar JSON

  type PresignedPayload {
    url: String!
    fields: JSON
  }

  type Payload {
    token: String!
  }

  type ResetPasswordPayload {
    success: Boolean!
  }

  input UserCredentials {
    email: String! @constraint(format: "email", maxLength: 255)
    password: String! @constraint(minLength: 3)
  }

  type Mutation {
    register(credentials: UserCredentials!): Payload
    login(credentials: UserCredentials!): Payload
    resetPassword(credentials: UserCredentials!): ResetPasswordPayload
    sendResetPasswordLink(email: String!): ResetPasswordPayload
    getSecret(id: String!): Payload
    createPresignedPost(userId: String!, key: String!): PresignedPayload
  }

  type Query {
    getToken: Payload
  }
`

export default typeDefs
