// @flow
import React from 'react'
import PropTypes from 'prop-types'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import PostMetaForm from './PostMetaForm'
import { POST_QUERY } from '../../mutations'
import gql from 'graphql-tag'
import type { post } from '../../../../types'

type Props = {
  updatePost: () => void,
  onClose: () => void,
  open: boolean,
  client: any,
  post: {
    Post: post,
    variables: { id: string }
  }
}

export default class EditPostMetaModal extends React.PureComponent<Props> {
  static propTypes = {
    updatePost: PropTypes.func,
    onClose: PropTypes.func,
    client: PropTypes.object,
    post: PropTypes.object,
    open: PropTypes.bool
  }

  handlePostMetaUpdate = (evt: any) => {
    let {
      document: postDocument,
      postMeta: postPostMeta
    } = this.props.post.Post
    let {
      id: documentId,
      excerpt
    } = postDocument
    let {
      __typename: postMetaTypename,
      ...postMeta
    } = postPostMeta
    this.props.client.mutate({
      mutation: gql`
        mutation($id: ID!, $excerpt: String!) {
          updateDocument(id: $id, excerpt: $excerpt) {
            id
          }
        }
      `,
      variables: { id: documentId, excerpt }
    })
    this.props.client.mutate({
      mutation: gql`
        mutation($id: ID!, $title: String, $slug: String, $status: PostStatus!) {
          updatePostMeta (id: $id, title: $title, slug: $slug, status: $status) {
            id
          }
        }
      `,
      variables: postMeta
    })
    this.props.onClose()
  }

  handleChange = (evt: any, key: string) => {
    let { Post } = this.props.post
    let value = evt.target.value
    let data = {
      query: POST_QUERY,
      variables: this.props.post.variables
    }
    if (key === 'excerpt') {
      data.data = {
        Post: {
          ...Post,
          document: {
            ...Post.document,
            excerpt: value
          }
        }
      }
    } else {
      data.data = {
        Post: {
          ...Post,
          postMeta: {
            ...Post.postMeta,
            [key]: value
          }
        }
      }
    }
    this.props.client.writeQuery(data)
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
