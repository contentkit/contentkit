import React from 'react'
import PropTypes from 'prop-types'
import { Dialog, DialogTitle, DialogActions, DialogContent } from '@material-ui/core'
import { useApolloClient } from '@apollo/client'
import gql from 'graphql-tag'

import PostMetaForm from '../PostEditorMetaModalForm'
import { POST_QUERY } from '../../graphql/queries'
import Button from '../Button'

const UPDATE_POSTS = gql`
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
`

const getDate = ({ posts }) => {
  const date = posts?.data?.posts[0]?.published_at
  return date
}

function EditPostMetaModal (props) {
  const client = useApolloClient()
  const [dateInputState, setDateInput] = React.useState(getDate(props))
  const {
    onClose,
    open,
    users,
    posts: {
      data: {
        posts
      }
    },
    createImage,
    deleteImage,
    getFormData,
    mediaProvider
  } = props

  const handlePostMetaUpdate = async (evt) => {
    onClose()

    const {
      id,
      title,
      status,
      excerpt,
      cover_image_id,
      published_at,
      created_at,
      project: {
        id: projectId
      }
    } = posts[0]
    const variables = {
      id,
      title,
      status,
      publishedAt: published_at || created_at,
      projectId: projectId,
      excerpt: excerpt,
      coverImageId: cover_image_id
    }

    await client.mutate({
      mutation: UPDATE_POSTS,
      variables
    })
  }

  const onChange = (value: any, key: string): void => {
    client.writeQuery({
      query: POST_QUERY,
      variables: props.posts.variables,
      data: {
        posts: [{
          ...posts[0],
          [key]: value
        }]
      }
    })
  }

  const onCoverImageChange = (imageId: string): void => {
    client.writeQuery({
      query: POST_QUERY,
      variables: props.posts.variables,
      data: {
        posts: [{
          ...posts[0],
          cover_image_id: imageId
        }]
      }
    })
  }

  const selectProject = (id: string): void => {
    client.writeQuery({
      query: POST_QUERY,
      variables: props.posts.variables,
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

  const post = props?.posts?.data?.posts[0]
  if (!post) return false

  const title = (<h2>Update Postmeta</h2>)
  return (
    <Dialog
      fullWidth
      open={open}
      onClose={onClose}
      maxWidth='md'
      PaperProps={{

      }}
    >
      <DialogTitle>
        {title}
      </DialogTitle>
      <DialogContent>
        <PostMetaForm
          users={users}
          post={posts[0]}
          onChange={onChange}
          onDateInputChange={setDateInput}
          onCoverImageChange={onCoverImageChange}
          selectProject={selectProject}
          getFormData={getFormData}
          createImage={createImage}
          deleteImage={deleteImage}
          mediaProvider={mediaProvider}
          client={client}
        />
      </DialogContent>
      <DialogActions>
        <Button color='secondary' onClick={onClose}>
          Cancel
        </Button>
        <Button color='default' onClick={handlePostMetaUpdate}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}


EditPostMetaModal.propTypes = {
  createImage: PropTypes.func.isRequired,
  updatePost: PropTypes.func,
  onClose: PropTypes.func,
  client: PropTypes.object,
  posts: PropTypes.object.isRequired,
  open: PropTypes.bool,
  users: PropTypes.object.isRequired
}

export default EditPostMetaModal
