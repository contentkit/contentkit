import gql from 'graphql-tag'

export const UPDATE_DOCUMENT = gql`
  mutation (
    $id: ID!,
    $raw: Json!
    $html: String
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
    $id: ID!,
    $postMeta: PostpostMetaPostMeta!
    $document: PostdocumentDocument!
    ) {
    updatePost(
      id: $id
      postMeta: $postMeta
      document: $document
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
      postMeta {
        id
        title
        slug
        status
        excerpt
      }
    }
  }
`
export const POST_QUERY = gql`
  query ($id: ID!) {
    Post (id: $id) {
      id
      createdAt
      project {
        id
      }
      postMeta {
        id
        title
        slug
        status
        date
        excerpt
      }
      document {
        id
        raw
        html
        excerpt
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

export const createVersion = async ({ post, client, raw }) => {
  const { Post } = post
  const documentId = Post && Post.document && Post.document.id
  if (!documentId) return
  const { data: { createVersion } } = await client.mutate({
    mutation: gql`
      mutation($documentId: ID!, $raw: Json!) {
        createVersion(documentId: $documentId, raw: $raw) {
          id
          raw
          createdAt
        }
      }
    `,
    variables: {
      raw,
      documentId
    }
  })
  const versions = [...Post.document.versions]
  versions.push(createVersion)
  const data = {
    Post: {
      ...Post,
      document: {
        ...Post.document,
        versions
      }
    }
  }
  client.cache.writeQuery({
    query: POST_QUERY,
    variables: { id: Post.id },
    data
  })
  return { data }
}
