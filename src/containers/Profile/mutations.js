// @flow
import gql from 'graphql-tag'

export const UPDATE_USER = gql`
  mutation updateUser($name: String!, $email: String!) {
    updateUser(name: $name, email: $email) {
      id
      email
      name
      secret
    }
  }
`

export const USER_QUERY = gql`
  query userQuery {
    user {
      id
      email
      name
      secret
    }
  }
`

export const GENERATE_TOKEN = gql`
  mutation {
    generateToken {
      id
      secret
    }
  }
`
