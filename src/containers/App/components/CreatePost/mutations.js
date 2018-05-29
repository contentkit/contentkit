// @flow
import gql from 'graphql-tag'
import fragments from '../../../../lib/fragments'

export const findIndex = (arr, id) => {
  let index = 0
  while (index < arr.length) {
    if (arr[index].id === id) {
      break
    }
    index++
  }
  return index >= arr.length ? -1 : index
}

export const CREATE_POST = gql`
  mutation createPost(
    $userId: ID!,
    $postMeta: PostpostMetaPostMeta!
    $document: PostdocumentDocument!
    $projectId: ID!
    $title: String
    $slug: String
    $status: PostStatus
  ) {
    createPost(
      userId: $userId
      document: $document
      projectId: $projectId
      postMeta: $postMeta
      title: $title
      slug: $slug
      status: $status
    ) {
      id
      createdAt
      project {
        id
        name
      }
      document {
        id
        raw
        excerpt
        versions {
          id
        }
      }
      postMeta {
        id
        title
        slug
        status
      }
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
  mutation ($name: String!, $userId: ID!) {
    createProject(name: $name, userId: $userId) {
      name
      id
    }
  }
`
