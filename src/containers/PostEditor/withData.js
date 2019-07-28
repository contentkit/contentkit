// @flow
import React from 'react'
import {
  CREATE_IMAGE,
  DELETE_IMAGE,
  UPDATE_DOCUMENT
} from '../../graphql/mutations'
import { POST_QUERY } from '../../graphql/queries'

import { Query, Mutation } from 'react-apollo'

const withData = Component =>
  class extends React.Component {
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
            __typename: 'Post',
            ...post.data.post,
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
                ...updateDocument
              }
            }
          }
          store.writeQuery(data)
        }
      })

    render () {
      return (
        <Query variables={{ id: this.props.match.params.id }} query={POST_QUERY}>
          {(post) => post.loading ? null : (
            <Mutation mutation={UPDATE_DOCUMENT}>
              {(updateDocument, updateDocumentData) => (
                <Mutation mutation={CREATE_IMAGE}>
                  {(createImage, { data: createImageData }) => (
                    <Mutation mutation={DELETE_IMAGE}>
                      {(deleteImage) => (
                        <Component
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
                      )}
                    </Mutation>
                  )}
                </Mutation>
              )}
            </Mutation>
          )}
        </Query>
      )
    }
  }

export default withData
