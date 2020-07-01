import React from 'react'
import { CSSTransition } from 'react-transition-group'

import { Editor } from '@contentkit/editor'
import { HANDLED, Command, insertAtomic, Block } from '@contentkit/util'
import { useApolloClient } from '@apollo/client'
import LinearProgress from '@material-ui/core/LinearProgress'
import gql from 'graphql-tag'

import '@contentkit/editor/src/css/Draft.css'
import '@contentkit/editor/src/css/prism.css'
import '@contentkit/editor/src/css/CheckableListItem.css'

import { CREATE_IMAGE } from '../../graphql/mutations'
import useStyles from './styles'
import { AWS_BUCKET_URL } from '../../lib/config'
import { Dropzone } from '@contentkit/components'
import { DropzoneVariant } from '@contentkit/components/lib/types'

const UPLOAD_MUTATION = gql`
  mutation($userId: String!, $key: String!) {
    createPresignedPost(userId: $userId, key: $key) {
      url
      fields
    }
  }
`

export function sanitizeFileName (name) {
  let filename = name.replace(/[^A-Za-z-_.0-9]/g, '')
  return filename || Math.random().toString(36).substr(2, 9) // handle case where filename is all special characters, e.g., %%==^.pdf
}

export async function uploadDocument (file, filename, payload) {
  const formData = new window.FormData()
  for (const field in payload.fields) {
    formData.append(field, payload.fields[field])
  }
  formData.append('file', file, filename)

  return fetch(payload.url, {
    method: 'POST',
    body: formData
  }).then(() => {
    window.URL.revokeObjectURL(file.preview)
  })
}

function PostEditorComponent(props) {
  const client = useApolloClient()
  const classes = useStyles(props)

  const {
    getFormData,
    insertImage,
    loading,
    editorState,
    onChange,
    save,
    posts,
    users
  } = props

  const addImage = (src) => {
    const nextEditorState = insertAtomic(editorState, Block.IMAGE, { src })
    onChange(nextEditorState)
  }

  const onUpload = async (file: File): Promise<void> => {
    const postId = posts[0].id
    const userId = users.data.users[0].id
    const { name, type, size } = file
    const filename = sanitizeFileName(name)
    const key = `static/${postId}/${filename}`
    const createPresignedPost = await getFormData({ key, userId })

    try {
      await uploadDocument(file, filename, createPresignedPost)
    } catch {
      return
    }
    const { data } = await client.mutate({
      mutation: CREATE_IMAGE,
      variables: {
        url: key,
        postId: postId,
        userId: userId
      }
    })

    addImage(`${AWS_BUCKET_URL}/${key}`)
  }

  const keyBindings = {
    [Command.EDITOR_SAVE]: (_, editorState) => {
      save()
      return HANDLED
    }
  }

  return (
    <>
      <CSSTransition
        classNames={'transition'}
        unmountOnExit
        timeout={1000}
        in={loading}
      >
        {state => (
          <LinearProgress className={classes.progress} />
        )}
      </CSSTransition>
      <Dropzone
        className={classes.root}
        onUpload={onUpload}
        variant={DropzoneVariant.FULL_WIDTH}
      >
        <div className={classes.editor}>
          <Editor
            editorState={editorState}
            onChange={onChange}
            keyBindings={keyBindings}
          />
        </div>
      </Dropzone>
    </>
  )
}

export default PostEditorComponent
