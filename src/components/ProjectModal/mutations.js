// @flow
import gql from 'graphql-tag'

export const PROJECT_QUERY = gql`
  query ($id: ID!) {
    Project(id: $id) {
      id
      name
      domains {
        id
        name
      }
    }
  }
`

export const DELETE_DOMAIN = gql`
  mutation ($id: ID!) {
    deleteDomain (
      id: $id
    ) {
      id
    }
  }
`

export const CREATE_DOMAIN = gql`
  mutation ($projectId: ID!, $name: String!) {
    createDomain (
      projectId: $projectId,
      name: $name
    ) {
      name
      id
      project {
        id
      }
    }
  }
`
