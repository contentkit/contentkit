// @flow
import gql from 'graphql-tag'

export const temporarySchemaUpdate = async ({
  selectedPost,
  client
}) => {
  if (selectedPost.document && selectedPost.postMeta) {
    return false
  }
  let { id } = selectedPost
  if (!selectedPost.document) {
    const { data: { Post } } = await client.query({
      query: gql`
        query($id: ID!) {
          Post(id: $id) {
            json
          }
        }
      `,
      variables: { id: selectedPost.id }
    })

    client.mutate({
      mutation: gql`
        mutation($raw: Json! $postId: ID!) {
          createDocument(raw: $raw, postId: $postId) {
            id
            raw
            excerpt
            versions {
              id
            }
          }
        }
      `,
      variables: { raw: Post.json, postId: id }
    })
  }

  if (!selectedPost.postMeta) {
    client.mutate({
      mutation: gql`
        mutation(
          $postId: ID!
          $title: String
          $slug: String
          $status: PostStatus
          $date: DateTime
          $excerpt: String
        ) {
          createPostMeta(
            postId: $postId
            title: $title
            slug: $slug
            status: $status
            excerpt: $excerpt
            date: $date
          ) {
            id
            title
            slug
            status
          }
        }
      `,
      variables: {
        postId: selectedPost.id,
        title: selectedPost.title,
        status: selectedPost.status,
        slug: selectedPost.slug
      }
    })
  }
}
