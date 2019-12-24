import React from 'react'
import PropTypes from 'prop-types'
import PostMetaForm from '../PostEditorMetaModalForm'
import { POST_QUERY } from '../../graphql/queries'
import gql from 'graphql-tag'
import { createInitialState, convertToDate } from 'draft-js-dates'
import Button from '../Button'
import { Dialog, DialogTitle, DialogActions, DialogContent } from '@material-ui/core'

export const _POST_QUERY = gql`
  query ($id: String!) {
    post (where: { id: { _eq: $id } }) {
      id
      published_at
      title
      slug
      status
      excerpt
    }
  }
`

const getDate = ({ posts }) => {
  const date = posts?.data?.posts[0]?.published_at
  return date
  // return (date ? new Date(date) : new Date()).toISOString()
}

class EditPostMetaModal extends React.Component {
  state = {
    dateInputState: getDate(this.props),
    projectId: this.props.posts?.data?.posts[0]?.project?.id
  }

  static propTypes = {
    createImage: PropTypes.func.isRequired,
    updatePost: PropTypes.func,
    onClose: PropTypes.func,
    client: PropTypes.object,
    posts: PropTypes.object.isRequired,
    open: PropTypes.bool,
    users: PropTypes.object.isRequired
  }

  handlePostMetaUpdate = async (evt) => {
    this.props.onClose()

    const {
      id,
      title,
      status,
      excerpt,
      cover_image_id,
      published_at,
      project: {
        id: projectId
      }
    } = this.props.posts.data.posts[0]
    const variables = {
      id,
      title,
      status,
      publishedAt: published_at,
      projectId: projectId,
      excerpt: excerpt,
      coverImageId: cover_image_id
    }

    await this.props.client.mutate({
      mutation: gql`
        mutation(
          $id: String!
          $title: String
          $status: post_status!
          $publishedAt: timestamp!
          $projectId: String
          $coverImageId: String
          $excerpt: String
        ) {
          update_posts (
            _set: {
              id: $id
              title: $title
              status: $status
              published_at: $publishedAt
              project_id: $projectId
              excerpt: $excerpt
              cover_image_id: $coverImageId
            },
            where: {
              id: {
                _eq: $id
              }
            }
          ) {
            returning { id }
          }
        }
      `,
      variables
    })
  }

  handleChange = (value, key) => {
    const { posts } = this.props.posts.data
    this.props.client.writeQuery({
      query: POST_QUERY,
      variables: this.props.posts.variables,
      data: {
        posts: [{
          ...posts[0],
          [key]: value
        }]
      }
    })
  }

  handleCoverImageChange = (imageId) => {
    const { client, posts: { variables, data: { posts } } } = this.props
    client.writeQuery({
      query: POST_QUERY,
      variables: variables,
      data: {
        posts: [{
          ...posts[0],
          cover_image_id: imageId
        }]
      }
    })
  }

  selectProject = (id) => {
    let { posts } = this.props.posts.data

    this.props.client.writeQuery({
      query: POST_QUERY,
      variables: this.props.posts.variables,
      data: {
        post: [{
          ...posts[0],
          project: {
            __typename: 'Project',
            id
          }
        }]
      }
    })
  }

  handleDateInputChange = (dateInputState) => {
    this.setState({ dateInputState })
  }

  render () {
    const {
      open,
      onClose,
      createImage,
      deleteImage,
      client,
      getFormData
    } = this.props
    const post = this.props?.posts?.data?.posts[0]
    if (!post) return false

    const title = (<h2>Update Postmeta</h2>)
    return (
      <Dialog
        fullWidth
        open={open}
        onClose={onClose}
        maxWidth='md'
        PaperProps={{
          square: true
        }}
      >
        <DialogTitle>
          {title}
        </DialogTitle>
        <DialogContent>
          <PostMetaForm
            users={this.props.users}
            post={this.props.posts?.data?.posts[0]}
            handleChange={this.handleChange}
            handleDateInputChange={this.handleChange}
            handleCoverImageChange={this.handleCoverImageChange}
            selectProject={this.selectProject}
            getFormData={getFormData}
            createImage={createImage}
            deleteImage={deleteImage}
            client={client}
          />
        </DialogContent>
        <DialogActions>
          <Button color='secondary' onClick={this.props.onClose}>
            Cancel
          </Button>
          <Button color='default' onClick={this.handlePostMetaUpdate}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}


export default EditPostMetaModal
