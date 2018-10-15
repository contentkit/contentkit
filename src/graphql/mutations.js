import gql from 'graphql-tag'

export const UPDATE_DOCUMENT = gql`
  mutation (
    $id: ID!
    $raw: JSON!
    $html: String!
  ) {
    updateDocument(
      id: $id
      raw: $raw
      html: $html
    ) {
      id
      raw
      html
      versions {
        id
        raw
        createdAt
      }
    }
  }
`

export const DELETE_VERSION = gql`
  mutation ($id: ID!) {
    deleteVersion(id: $id) {
      id
    }
  }
`

export const UPDATE_POST = gql`
  mutation (
    $id: ID!
    $title: String!
    $status: PostStatus
    $publishedAt: String
  ) {
    updatePostMeta(
      id: $id
      title: $title
      status: $status
      publishedAt: $publishedAt
    ) {
      id
      createdAt
      images {
        id
        url
      }
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
      id
      title
      slug
      status
      excerpt
    }
  }
`
export const POST_QUERY = gql`
  query ($id: ID!) {
    post (id: $id) {
      id
      createdAt
      publishedAt
      project {
        id
      }
      id
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
    }
  }
`

export const CREATE_IMAGE = gql`
  mutation ($url: String!, $postId: ID!) {
    createImage (url: $url, postId: $postId) {
      id
      url
    } 
  }
`

export const DELETE_IMAGE = gql`
  mutation ($id: ID!) {
    deleteImage (id: $id) {
      id
    } 
  }
`