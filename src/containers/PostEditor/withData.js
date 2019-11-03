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
    createImage = ({ mutate, posts }) => variables => mutate({
      variables,
      optimisticResponse: {
        __typename: 'Mutation',
        insert_images: {
          __typename: 'images_mutation_response',
          returning: [{
            __typename: 'Image',
            id: variables.url,
            ...variables
          }]
        }
      },
      update: (store, { data: { insert_images } }) => {
        store.writeQuery({
          query: POST_QUERY,
          data: {
            posts: [{
              ...posts.data.posts[0],
              images: [...posts.data.posts[0].images].concat(insert_images.returning)
            }]
          },
          variables: posts.variables
        })
      }
    })

    deleteImage = ({ mutate, posts }) => variables => mutate({
      variables,
      optimisticResponse: {
        __typename: 'Mutation',
        delete_images: {
          __typename: 'images_mutation_response',
          response: [{
            __typename: 'Image',
            ...variables
          }]
        }
      },
      update: (store, { data: { delete_images } }) => {
        let images = [...posts.data.posts[0].images]
        images = images.filter(img => img.id !== variables.id)
        store.writeQuery({
          query: POST_QUERY,
          data: {
            posts: [{
              ...posts.data.posts[0],
              images
            }]
          },
          variables: posts.variables
        })
      }
    })

    updateDocument = ({ mutate, posts }) =>
      variables => mutate({
        variables,
        optimisticResponse: {
          __typename: 'Mutation',
          update_posts: {
            __typename: 'posts_mutation_response',
            returning: [{
              __typename: 'Post',
              ...posts.data.posts[0],
              ...variables
            }]
          }
        },
        update: (store, { data: { update_posts } }) => {
          const data = {
            query: POST_QUERY,
            variables: { id: posts.data.posts[0].id },
            data: {
              posts: [{
                ...posts.data.posts[0],
                ...update_posts.returning[0]
              }]
            }
          }
          store.writeQuery(data)
        }
      })

    render () {
      return (
        <Query variables={{ id: this.props.match.params.id }} query={POST_QUERY}>
          {(posts) => posts.loading ? null : (
            <Mutation mutation={UPDATE_DOCUMENT}>
              {(updateDocument, updateDocumentData) => (
                <Mutation mutation={CREATE_IMAGE}>
                  {(createImage, { data: createImageData }) => (
                    <Mutation mutation={DELETE_IMAGE}>
                      {(deleteImage) => (
                        <Component
                          {...this.props}
                          posts={posts}
                          updateDocument={{
                            mutate: this.updateDocument({
                              mutate: updateDocument,
                              posts
                            }),
                            ...updateDocumentData
                          }}
                          createImage={this.createImage({
                            mutate: createImage,
                            posts
                          })}
                          deleteImage={this.deleteImage({
                            mutate: deleteImage,
                            posts
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
