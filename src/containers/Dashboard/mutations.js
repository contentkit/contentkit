// @flow
import gql from 'graphql-tag'

export const DELETE_POST = gql`
  mutation ($id: ID!) {
    deletePost(id: $id) {
      id
    }
  }
`

// export const CREATE_DOCUMENT = gql`
//  mutation ($raw: Json!, $postId: ID!, $latest: Int!) {
//    createDocument(raw: $raw, postId: $postId, latest: $latest) {
//      raw
//      id
//   }
//  }
// `

// export const DELETE_DOCUMENT = gql`
//  mutation ($id: ID!) {
//    deleteDocument(id: $id) {
//      id
//    }
//  }
//`
