// @flow
import React from 'react'
import {
  CREATE_IMAGE,
  UPDATE_POST,
  DELETE_IMAGE,
  UPDATE_DOCUMENT
} from '../../graphql/mutations'
import { POST_QUERY } from '../../graphql/queries'

import { Query, Mutation } from 'react-apollo'
import PostEditor from './PostEditor'

class EditorMutations extends React.Component<{}, {}> {
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
      const images = [...post.data.post.images]
      images.push(createImage)
      store.writeQuery({
        query: POST_QUERY,
        data: {
          post: {
            ...post.data.post,
            images
          }
        },
        variables: post.variables
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
      let images = [...post.data.post.images]
      images = images.filter(img => img.id !== variables.id)
      store.writeQuery({
        query: POST_QUERY,
        data: {
          post: {
            ...post.data.post,
            images
          }
        },
        variables: post.variables
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
          ...post.data.post.document,
          ...variables
        }
      },
      update: (store, { data: { updateDocument } }) => {
        const data = {
          query: POST_QUERY,
          variables: { id: post.data.post.id },
          data: {
            post: {
              ...post.data.post,
              document: {
                ...post.data.post.document,
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
      <Query variables={{ ...this.props.match.params }} query={POST_QUERY}>
        {(post) => {
          if (post.loading) return null
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
      </Query>
    )
  }
}

export default EditorMutations
