import gql from 'graphql-tag'

export const UPDATE_USER = gql`
  mutation updateUser($name: String!, $id: ID!, $email: String!) {
    updateUser(name: $name, id: $id, email: $email) {
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
  mutation ($id: ID!) {
    generateToken (
      id: $id
    ) {
      id
      secret
    }
  }
`
