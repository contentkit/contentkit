// @flow
import gql from 'graphql-tag'
import fragments from '../../lib/fragments'

export const PROJECTS_QUERY = gql`
  query {
    allProjects {
      ...ProjectFields
    }
  }
  ${fragments.project}
`

export const POSTS_QUERY = gql`
  query (
    $limit: Int, 
    $offset: Int, 
    $query: String,
    $projectId: ID
  ) {
    allPosts(
      limit: $limit,
      offset: $offset,
      query: $query,
      projectId: $projectId
    ) {
      id
      createdAt
      publishedAt
      project {
        id
        name
      }
      title
      slug
      status
      excerpt
      document {
        id
        raw
        versions {
          id
        }
      }
    }
  }
`
export const POST_QUERY = gql`
  query ($id: ID!) {
    Post (id: $id) {
      id
      createdAt
      publishedAt
      document {
        id
        raw
        versions {
          id
        }
      }
      images {
        id
        url
      }
      title
      slug
      status
      excerpt
    }
  }
`
