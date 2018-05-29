// @flow
import gql from 'graphql-tag'
import fragments from '../../lib/fragments'

export const PROJECTS_QUERY = gql`
  query ($id: ID!) {
    allProjects(filter: {
      user: {
        id: $id
      }
    }) {
      ...ProjectFields
    }
  }
  ${fragments.project}
`
// orderBy: createdAt_DESC,

export const POSTS_QUERY = gql`
  query (
    $id: ID!, 
    $after: String, 
    $before: String, 
    $first: Int,
    $last: Int,
    $skip: Int,
    $query: String,
    $projectId: ID
    ) {
    allPosts(
      first: $first,
      last: $last,
      after: $after,
      before: $before, 
      skip: $skip,
      orderBy: createdAt_DESC, 
      filter: {
        user: {
          id: $id
        },
        postMeta: {
          title_contains: $query,
        },
        project: {
          id: $projectId
        }
    }) {
      id
      createdAt
      project {
        id
        name
      }
      postMeta {
        id
        title
        slug
        status
      }
      document {
        id
        raw
        excerpt
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
      document {
        id
        raw
        excerpt
        versions {
          id
        }
      }
      images {
        id
        url
      }
      postMeta {
        title
        slug
        status
        id
      }
    }
  }
`
