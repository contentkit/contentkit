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
        tags {
          id
          name
        }
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
        encodedHtml
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

export const TAG_QUERY = gql`
  query($postId: ID!) {
    tagsByPost(postId: $postId) {
      id
      name
      description
      slug
    }
  }
`