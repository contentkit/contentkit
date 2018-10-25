// @flow
import React from 'react'
import PropTypes from 'prop-types'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import PostMetaForm from '../PostEditorMetaModalForm'
import { POST_QUERY } from '../../graphql/queries'
import gql from 'graphql-tag'
import type { Post } from '../../types'
import { createInitialState, convertToDate } from 'draft-js-dates'

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

type Props = {
  updatePost: () => void,
  onClose: () => void,
  open: boolean,
  client: any,
  post: {
    Post: Post,
    variables: { id: string }
  }
}

const getDate = ({ post: { data: { post } } }) => {
  let date = post && post.publishedAt
  return date ? new Date(date) : new Date()
}

export default class EditPostMetaModal extends React.PureComponent<Props, {}> {
  state = {
    dateInputState: createInitialState(getDate(this.props)),
    projectId: this.props.post.data.post.project.id
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

    this.props.onClose()
  }

  handleChange = (evt: any, key: string) => {
    let { post } = this.props.post.data
    let value = evt.target.value
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
    return (
      <div>
        <Dialog
          open={open}
          maxWidth={'md'}
        >
          <DialogTitle disableTypography>
            <h2>Update Postmeta</h2>
          </DialogTitle>
          <DialogContent>
            <PostMetaForm
              post={this.props.post}
              handleChange={this.handleChange}
              user={this.props.user}
              dateInputState={this.state.dateInputState}
              handleDateInputChange={this.handleDateInputChange}
              selectProject={this.selectProject}
              data={this.props.post?.data?.post}
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant='text'
              color='primary'
              onClick={onClose}
            >Cancel</Button>
            <Button
              variant='contained'
              color='primary'
              onClick={this.handlePostMetaUpdate}
            >Update</Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}
