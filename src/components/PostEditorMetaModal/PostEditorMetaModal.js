import React from 'react'
import PropTypes from 'prop-types'
import PostMetaForm from '../PostEditorMetaModalForm'
import { POST_QUERY } from '../../graphql/queries'
import gql from 'graphql-tag'
import { createInitialState, convertToDate } from 'draft-js-dates'

import Modal from 'antd/lib/modal'

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

const getDate = ({ post: { data: { post } } }) => {
  let date = post && post.publishedAt
  return date ? new Date(date) : new Date()
}

class EditPostMetaModal extends React.Component {
  state = {
    dateInputState: createInitialState(getDate(this.props)),
    projectId: this.props.post?.data?.post?.project?.id
  }

  static propTypes = {
    updatePost: PropTypes.func,
    onClose: PropTypes.func,
    client: PropTypes.object,
    post: PropTypes.object,
    open: PropTypes.bool,
    user: PropTypes.object
  }

  handlePostMetaUpdate = async (evt: any) => {
    this.props.onClose()

    let {
      document,
      id,
      title,
      status,
      ...rest
    } = this.props.post.data.post
    let date = convertToDate(this.state.dateInputState).toISOString()
    await this.props.client.mutate({
      mutation: gql`
        mutation(
          $id: ID!
          $title: String
          $status: PostStatus
          $publishedAt: String
          $projectId: ID
        ) {
          updatePost (
            id: $id
            title: $title
            status: $status
            publishedAt: $publishedAt
            projectId: $projectId
          ) {
            id
          }
        }
      `,
      variables: {
        id,
        title,
        status,
        publishedAt: date,
        projectId: rest.project.id
      }
    })
  }

  handleChange = (value, key) => {
    let { post } = this.props.post.data
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
    const { post: { data: { post } }, open, onClose } = this.props
    if (!post) return false

    const title = (<h2>Update Postmeta</h2>)
    return (
      <Modal
        visible={open}
        title={title}
        onCancel={onClose}
        onOk={this.handlePostMetaUpdate}
        width={700}
      >
        <PostMetaForm
          post={this.props.post}
          handleChange={this.handleChange}
          user={this.props.user}
          dateInputState={this.state.dateInputState}
          handleDateInputChange={this.handleDateInputChange}
          selectProject={this.selectProject}
          data={this.props.post?.data?.post}
        />
      </Modal>
    )
  }
}

export default EditPostMetaModal
