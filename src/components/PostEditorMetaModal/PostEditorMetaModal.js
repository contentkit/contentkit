import React from 'react'
import PropTypes from 'prop-types'
import PostMetaForm from '../PostEditorMetaModalForm'
import { POST_QUERY } from '../../graphql/queries'
import gql from 'graphql-tag'
import { createInitialState, convertToDate } from 'draft-js-dates'

import { Dialog, DialogContent } from '@material-ui/core'

export const _POST_QUERY = gql`
  query ($id: ID!) {
    post (id: $id) {
      id
      publishedAt
      title
      slug
      status
      excerpt
    }
  }
`

const getDate = ({ post }) => {
  const date = post?.data?.post?.publishedAt
  return date ? new Date(date) : new Date()
}

class EditPostMetaModal extends React.Component {
  state = {
    dateInputState: createInitialState(getDate(this.props)),
    projectId: this.props.post?.data?.post?.project?.id
  }

  static propTypes = {
    createImage: PropTypes.func.isRequired,
    updatePost: PropTypes.func,
    onClose: PropTypes.func,
    client: PropTypes.object,
    post: PropTypes.object,
    open: PropTypes.bool,
    user: PropTypes.object
  }

  handlePostMetaUpdate = async (evt) => {
    this.props.onClose()

    const {
      document,
      id,
      title,
      status,
      excerpt,
      coverImage,
      project: {
        id: projectId
      }
    } = this.props.post.data.post
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
          $id: ID!
          $title: String
          $status: PostStatus
          $publishedAt: String
          $projectId: ID
          $coverImageId: ID
          $excerpt: String
        ) {
          updatePost (
            id: $id
            title: $title
            status: $status
            publishedAt: $publishedAt
            projectId: $projectId
            excerpt: $excerpt
            coverImageId: $coverImageId
          ) {
            id
          }
        }
      `,
      variables
    })
  }

  handleChange = (value, key) => {
    const { post } = this.props.post.data
    this.props.client.writeQuery({
      query: POST_QUERY,
      variables: this.props.post.variables,
      data: {
        post: {
          ...post,
          [key]: value
        }
      }
    })
  }

  handleCoverImageChange = (imageId) => {
    const { client, post: { variables, data: { post } } } = this.props
    client.writeQuery({
      query: POST_QUERY,
      variables: variables,
      data: {
        post: {
          ...post,
          coverImage: {
            id: imageId,
            __typename: 'Image'
          }
        }
      }
    })
  }

  selectProject = (id) => {
    let { post } = this.props.post.data

    this.props.client.writeQuery({
      query: POST_QUERY,
      variables: this.props.post.variables,
      data: {
        post: {
          ...post,
          project: {
            __typename: 'Project',
            id
          }
        }
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
    const post = this.props?.post?.data?.post
    if (!post) return false

    const title = (<h2>Update Postmeta</h2>)
    return (
      <Dialog
        fullWidth
        open={open}
        // title={title}
        onClose={onClose}
        // onOk={this.handlePostMetaUpdate}
        // width={700}
        size='md'
      >
        <DialogContent>
          <PostMetaForm
            user={this.props.user}
            post={this.props.post?.data?.post}
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
      </Dialog>
    )
  }
}

export default EditPostMetaModal
