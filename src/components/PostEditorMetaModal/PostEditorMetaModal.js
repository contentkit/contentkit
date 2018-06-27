// @flow
import React from 'react'
import PropTypes from 'prop-types'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import PostMetaForm from '../PostEditorMetaModalForm'
import { POST_QUERY } from '../../containers/PostEditor/mutations'
import gql from 'graphql-tag'
import type { Post } from '../../types'
import { createInitialState, convertToDate } from 'draft-js-dates'

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

const getDate = ({ post: { Post }}) => {
  let date = (Post && Post.postMeta.date)
  return date ? new Date(date) : new Date()
}

export default class EditPostMetaModal extends React.PureComponent<Props, {}> {
  state = {
    dateInputState: createInitialState(getDate(this.props))
  }

  static propTypes = {
    updatePost: PropTypes.func,
    onClose: PropTypes.func,
    client: PropTypes.object,
    post: PropTypes.object,
    open: PropTypes.bool,
    auth: PropTypes.object
  }

  handlePostMetaUpdate = (evt: any) => {
    let {
      postMeta,
      document
    } = this.props.post.Post
    let date = convertToDate(this.state.dateInputState).toISOString()
    console.log({ date })
    this.props.client.mutate({
      mutation: gql`
        mutation(
          $id: ID!,
          $title: String,
          $slug: String,
          $status: PostStatus!,
          $date: DateTime
        ) {
          updatePostMeta (
            id: $id,
            title: $title,
            slug: $slug,
            status: $status,
            date: $date
          ) {
            id
          }
        }
      `,
      variables: {
        ...postMeta,
        date: date
      }
    })
    this.props.onClose()
  }

  handleChange = (evt: any, key: string) => {
    let { Post } = this.props.post
    let value = evt.target.value
    this.props.client.writeQuery({
      query: POST_QUERY,
      variables: this.props.post.variables,
      data: {
        Post: {
          ...Post,
          postMeta: {
            ...Post.postMeta,
            [key]: value
          }
        }
      }
    })
  }

  handleDateInputChange = (dateInputState) => {
    this.setState({ dateInputState })
  }

  render () {
    const { post: { Post }, open, onClose } = this.props
    if (!Post) return false

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
              auth={this.props.auth}
              dateInputState={this.state.dateInputState}
              handleDateInputChange={this.handleDateInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant='flat'
              color='primary'
              onClick={onClose}
            >Cancel</Button>
            <Button
              variant='raised'
              color='primary'
              onClick={this.handlePostMetaUpdate}
            >Update</Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}
