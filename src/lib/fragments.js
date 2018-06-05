import gql from 'graphql-tag'

export const post = gql`
  fragment PostFields on Post {
    id
    createdAt
  }
`

export const user = gql`
  fragment UserFields on User {
    id
    email
    name
    secret
  }
`

export const project = gql`
  fragment ProjectFields on Project {
    id
    name
  }
`

export const postMeta = gql`
  fragment PostMetaFields on PostMeta {
    id
    createdAt
    slug
    title
    status
    excerpt
    date
  }
`

export default {
  post,
  user,
  project
}
