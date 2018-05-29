import { Seq } from 'immutable'
import gql from 'graphql-tag'
import { POST_QUERY } from '../../mutations'

export const removeVersions = (post, client, versionId) => {
  const { Post } = post
  let allVersions = Post.document.versions
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
    variables: { id: Post.id },
    data: {
      Post: {
        ...Post,
        document: {
          ...Post.document,
          versions: Seq(allVersions)
            .takeWhile(v => v.id !== versionId)
            .toArray()
            .concat([documentVersion])
        }
      }
    }
  })
}
