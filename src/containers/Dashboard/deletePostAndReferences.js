// @flow
import { DELETE_DOCUMENT, DELETE_POST } from './mutations'
import { POSTS_QUERY } from './queries'
import gql from 'graphql-tag'

const deletePost = ({ client, id }) => client.mutate({
  mutation: DELETE_POST,
  variables: { id }
})

const deleteDocument = ({ client, post }) => client.mutate({
  mutation: DELETE_DOCUMENT,
  variables: { id: post.document.id }
})

const deleteVersion = ({ client }) => ({ id }) => client.mutate({
  mutation: gql`
    mutation($id: ID!) {
      deleteVersion(id: $id) {
        id
      }
    }
  `,
  variables: { id }
})

const updateCache = ({ client, posts, id }) => {
  const allPosts = [...posts.data.allPosts].filter(post =>
    post.id !== id
  )
  const { variables } = posts

  return client.cache.writeQuery({
    query: POSTS_QUERY,
    data: { allPosts },
    variables
  })
}

export const deletePostAndReferences = ({ posts, client }) => async ({ id }) => {
  updateCache({ client, posts, id })

  let post = posts.data.allPosts.find(post =>
    post.id === id
  )

  if (post.document) {
    if (post.document.versions.length) {
      await Promise.all(
        post.document.versions.map(deleteVersion({ client }))
      )
    }

    await deleteDocument({ client, post })
  }
  return deletePost({ client, id })
}
