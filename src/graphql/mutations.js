import gql from 'graphql-tag'

export const DELETE_POST = gql`
  mutation ($id: ID!) {
    deletePost(id: $id) {
      id
    }
  }
`

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
`

export const CREATE_PROJECT = gql`
  mutation ($name: String!) {
    createProject(name: $name) {
      name
      id
      origins {
        id
      }
    }
  }
`

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

export const UPDATE_USER = gql`
  mutation updateUser($name: String!, $email: String!) {
    updateUser(name: $name, email: $email) {
      id
      email
      name
      secret
    }
  }
`

export const GENERATE_TOKEN = gql`
  mutation {
    generateToken {
      id
      secret
    }
  }
`

export const UPDATE_PROJECT = gql`
  mutation ($id: ID!, $name: String!) {
    updateProject (
      id: $id,
      name: $name
    ) {
      id
      name
      origins {
        id
        name
      }
    }
  }
`

export const DELETE_PROJECT = gql`
  mutation ($id: ID!) {
    deleteProject (
      id: $id
    ) {
      id
    }
  }
`

export const AUTHENTICATE_USER = gql`
  mutation(
    $email: String!
    $password: String!
  ) {
    signinUser(
      email: $email,
      password: $password
    ) {
      token
    }
  }
`

export const SIGNUP_USER = gql`
  mutation(
    $email: String!,
    $password: String!,
  ) {
    createUser(email: $email, password: $password) {
      id
    }
    signinUser(
      email: $email,
      password: $password
    ) {
      token
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

