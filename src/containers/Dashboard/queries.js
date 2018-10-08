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
        date
        excerpt
      }
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
      postMeta {
        title
        slug
        status
        id
        date
        excerpt
      }
    }
  }
`
