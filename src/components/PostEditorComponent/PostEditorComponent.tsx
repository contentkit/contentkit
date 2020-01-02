import React from 'react'
import { CSSTransition } from 'react-transition-group'

import { Editor } from '@contentkit/editor'
import { HANDLED, NOT_HANDLED, Command, insertAtomic, Block } from '@contentkit/util'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/styles'
import { useApolloClient } from '@apollo/react-hooks'
import LinearProgress from '@material-ui/core/LinearProgress'
import gql from 'graphql-tag'

import '@contentkit/editor/src/css/Draft.css'
import '@contentkit/editor/src/css/prism.css'
import '@contentkit/editor/src/css/CheckableListItem.css'

import * as config from '../../lib/config'
import BaseDropzone from '../BaseDropzone'
import { CREATE_IMAGE } from '../../graphql/mutations'

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

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    flexBasis: '100%',
    marginTop: 48
  },
  progress: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: 5,
    top: 48
  },
  editor: {
    width: '100%',
    height: '100%'
  },
  drag: {
    borderColor: '#ccc',
    background: '#dbdbdb',
    backgroundImage: 'linear-gradient(-45deg,#d2d2d2 25%,transparent 25%,transparent 50%,#d2d2d2 50%,#d2d2d2 75%,transparent 75%,transparent)',
    backgroundSize: '40px 40px',
  }
}))

function PostEditorComponent(props) {
  const client = useApolloClient()
  const [isDragging, setDrag] = React.useState(false)
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

  const handleClick = () => {}

  const addImage = (src) => {
    const nextEditorState = insertAtomic(editorState, Block.IMAGE, { src })
    onChange(nextEditorState)
  }

  const onDrop = async (files, event) => {
    setDrag(false)
    const postId = posts[0].id
    const userId = users.data.users[0].id
    const [file] = files
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

    addImage(`https://s3.amazonaws.com/contentkit/${key}`)
  }

  const keyBindings = {
    [Command.EDITOR_SAVE]: (_, editorState) => {
      save()
      return HANDLED
    }
  }

  return (
    <BaseDropzone className={classes.root} onDrop={onDrop} setDrag={setDrag}>
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
      <div className={clsx(classes.editor, { [classes.drag]: isDragging })}>
        <Editor
          editorState={editorState}
          onChange={onChange}
          keyBindings={keyBindings}
        />
      </div>
    </BaseDropzone>
  )
}

export default PostEditorComponent
