import gql from 'graphql-tag'

export const PROJECTS_QUERY = gql`
  query {
    allProjects {
      id
      name
      origins {
        id
        name
      }
    }
  }
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
    }
  }
`

export const FEED_QUERY = gql`
  query (
    $limit: Int, 
    $offset: Int, 
    $query: String,
    $projectId: ID
  ) {
    feed(
      limit: $limit,
      offset: $offset,
      query: $query,
      projectId: $projectId
    ) {
      count
      posts { 
        id
        createdAt
        publishedAt
        title
        slug
        status
        excerpt
        project {
          id
          name
        }
      }
    }
  }
`

export const POST_QUERY = gql`
  query ($id: ID!) {
    post (id: $id) {
      id
      createdAt
      publishedAt
      title
      slug
      status
      excerpt
      document {
        id
        raw
        html
        versions {
          id
          raw
          createdAt
        }
      }
      images {
        id
        url
      }
      project {
        id
      }
    }
  }
`

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

export const USER_QUERY = gql`
  query {
    user {
      id
      email
      name
      secret
      projects {
        id
        name
      }
    }
  }
`
