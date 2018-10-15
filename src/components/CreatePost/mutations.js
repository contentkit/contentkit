// @flow
import gql from 'graphql-tag'
import fragments from '../../lib/fragments'

export const CREATE_POST = gql`
  mutation createPost(
    $title: String!
    $projectId: ID!
  ) {
    createPost(
      title: $title,
      projectId: $projectId
    ) {
      id
      createdAt
      publishedAt
      project {
        id
        name
      }
      document {
        id
        raw
        versions {
          id
        }
      }
      id
      title
      slug
      status
      excerpt
    }
  }
`

export const UPDATE_POST = gql`
  mutation updatePost($content: String!, $id: ID!) {
    createPost(
      content: $content
      id: $id
    ) {
     ...PostFields 
    }
  }
  ${fragments.post}
`

export const USER_QUERY = gql`
  query userQuery {
    user {
      ...UserFields
      projects {
        ...ProjectFields
      }
    }
  }
  ${fragments.user}
  ${fragments.project}
`

export const CREATE_PROJECT = gql`
  mutation ($name: String!) {
    createProject(name: $name) {
      name
      id
    }
  }
`
