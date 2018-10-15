// @flow
import { Seq } from 'immutable'
import gql from 'graphql-tag'
import { POST_QUERY } from '../../containers/PostEditor/mutations'
import type { Post } from '../../types'

type postQuery = {
  Post: Post
}

type client = {
  writeQuery: (data: any) => void,
  mutate: (data: any) => void
}

export const removeVersions = (
  post: postQuery,
  client: client,
  versionId: string
) => {
  let allVersions = post.data.post.document.versions
  let documentVersion = allVersions.find(v => v.id === versionId)
  let toDelete = Seq(allVersions)
    .skipUntil(v => v.id === versionId)
    .rest()
    .toArray()
  if (!toDelete.length) return
  while (toDelete.length) {
    let id = toDelete.shift().id
    client.mutate({
      mutation: gql`
        mutation($id: ID!) {
          deleteVersion (id: $id) {
            id
          }
        }
      `,
      variables: { id }
    })
  }
  client.cache.writeQuery({
    query: POST_QUERY,
    variables: { id: post.data.post.id },
    data: {
      post: {
        ...post.data.post,
        document: {
          ...post.data.post.document,
          versions: Seq(allVersions)
            .takeWhile(v => v.id !== versionId)
            .toArray()
            .concat([documentVersion])
        }
      }
    }
  })
}
