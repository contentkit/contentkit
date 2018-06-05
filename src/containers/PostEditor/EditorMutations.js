// @flow
import React from 'react'
import {
  POST_QUERY,
  CREATE_IMAGE,
  UPDATE_POST,
  DELETE_IMAGE,
  UPDATE_DOCUMENT
} from './mutations'
import { Query, Mutation } from 'react-apollo'
import PostEditor from './PostEditor'

class EditorMutations extends React.Component<{}, {}> {
  updatePost = ({ mutate, post }) => variables => mutate({
    variables,
    optimisticResponse: {
      __typename: 'Mutation',
      updatePost: {
        __typename: 'Post',
        ...post.Post,
        document: {
          __typename: 'Document',
          ...post.Post.document,
          ...variables.document
        },
        postMeta: {
          __typename: 'PostMeta',
          ...post.Post.postMeta,
          ...variables.postMeta
        }
      }
    },
    update: (store, { data }) => {
      store.writeQuery({
        query: POST_QUERY,
        variables: post.variables,
        data: {
          Post: {
            ...post.Post,
            document: {
              ...data.updatePost.document
            },
            postMeta: {
              ...data.updatePost.postMeta
            }
          }
        }
      })
    }
  })

  createImage = ({ mutate, post }) => variables => mutate({
    variables,
    optimisticResponse: {
      __typename: 'Mutation',
      createImage: {
        __typename: 'Image',
        id: variables.url,
        ...variables
      }
    },
    update: (store, { data: { createImage } }) => {
      const Post = {...post.Post}
      const images = [...Post.images]
      images.push(createImage)
      Post.images = images
      store.writeQuery({
        query: POST_QUERY,
        data: {
          Post
        },
        variables: {
          id: this.props.auth.user.id
        }
      })
    }
  })

  deleteImage = ({ mutate, post }) => variables => mutate({
    variables,
    optimisticResponse: {
      __typename: 'Mutation',
      deleteImage: {
        __typename: 'Image',
        ...variables
      }
    },
    update: (store, { data: { deleteImage } }) => {
      let images = [...post.Post.images]
      images = images.filter(img => img.id !== variables.id)
      const Post = {...post.Post}
      Post.images = images
      store.writeQuery({
        query: POST_QUERY,
        data: { Post },
        variables: {
          id: this.props.auth.user.id
        }
      })
    }
  })

  updateDocument = ({ mutate, post }) =>
    variables => mutate({
      variables,
      optimisticResponse: {
        __typename: 'Mutation',
        updateDocument: {
          __typename: 'Document',
          ...post.Post.document,
          ...variables
        }
      },
      update: (store, { data: { updateDocument } }) => {
        const data = {
          query: POST_QUERY,
          variables: { id: post.Post.id },
          data: {
            Post: {
              ...post.Post,
              document: {
                ...post.Post.document,
                ...updateDocument
              }
            }
          }
        }
        store.writeQuery(data)
      }
    })

  render () {
    return (
      <Query variables={{...this.props.match.params}} query={POST_QUERY}>
        {({ data, ...rest }) => {
          if (!(data && data.Post)) return null
          const post = {
            ...data,
            ...rest
          }
          return (
            <Mutation mutation={UPDATE_POST}>
              {(updatePost, { data: updatePostData }) => {
                return (
                  <Mutation mutation={UPDATE_DOCUMENT}>
                    {(updateDocument, updateDocumentData) => {
                      return (
                        <Mutation mutation={CREATE_IMAGE}>
                          {(createImage, { data: createImageData }) => {
                            return (
                              <Mutation mutation={DELETE_IMAGE}>
                                {(deleteImage) => {
                                  return (
                                    <PostEditor
                                      {...this.props}
                                      post={post}
                                      updateDocument={{
                                        mutate: this.updateDocument({
                                          mutate: updateDocument,
                                          post
                                        }),
                                        ...updateDocumentData
                                      }}
                                      updatePost={this.updatePost({
                                        mutate: updatePost,
                                        post
                                      })}
                                      createImage={this.createImage({
                                        mutate: createImage,
                                        post
                                      })}
                                      deleteImage={this.deleteImage({
                                        mutate: deleteImage,
                                        post
                                      })}
                                    />
                                  )
                                }}
                              </Mutation>
                            )
                          }}
                        </Mutation>
                      )
                    }}
                  </Mutation>
                )
              }}
            </Mutation>
          )
        }}
      </Query>
    )
  }
}

export default EditorMutations
