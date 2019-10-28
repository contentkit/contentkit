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
  return date ? new Date(date) : new Date()
}

class EditPostMetaModal extends React.Component {
  state = {
    dateInputState: createInitialState(getDate(this.props)),
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
      coverImage,
      project: {
        id: projectId
      }
    } = this.props.posts.data.posts[0]
    const date = convertToDate(this.state.dateInputState).toISOString()

    const variables = {
      id,
      title,
      status,
      publishedAt: date,
      projectId: projectId,
      excerpt: excerpt
    }

    if (coverImage) {
      variables.coverImageId = coverImage.id
    }

    await this.props.client.mutate({
      mutation: gql`
        mutation(
          $id: String!
          $title: String
          $status: PostStatus
          $publishedAt: String
          $projectId: String
          $coverImageId: String
          $excerpt: String
        ) {
          update_posts (
            objects: [{
              id: $id
              title: $title
              status: $status
              published_at: $publishedAt
              project_id: $projectId
              excerpt: $excerpt
              cover_image_id: $coverImageId
            }],
            where: {
              id: {
                _eq: $id
              }
            }
          ) {
            id
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
        post: [{
          ...posts[0],
          coverImage: {
            id: imageId,
            __typename: 'Image'
          }
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
      client
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
            dateInputState={this.state.dateInputState}
            handleDateInputChange={this.handleDateInputChange}
            handleCoverImageChange={this.handleCoverImageChange}
            selectProject={this.selectProject}
            createImage={createImage}
            deleteImage={deleteImage}
            client={client}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose}>
            Cancel
          </Button>
          <Button color='success' onClick={this.handlePostMetaUpdate}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default EditPostMetaModal
