// @flow
import gql from 'graphql-tag'

export const PROJECT_QUERY = gql`
  query ($id: ID!) {
    project(id: $id) {
      id
      name
      origins {
        id
        name
      }
    }
  }
`

export const DELETE_ORIGIN = gql`
  mutation ($id: ID!) {
    deleteOrigin (
      id: $id
    ) {
      id
    }
  }
`

export const CREATE_ORIGIN = gql`
  mutation ($projectId: ID!, $name: String!) {
    createOrigin (
      projectId: $projectId,
      name: $name,
      originType: DOMAIN
    ) {
      name
      id
      project {
        id
      }
    }
  }
`
