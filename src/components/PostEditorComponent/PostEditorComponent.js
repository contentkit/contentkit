import React from 'react'
import { CSSTransition } from 'react-transition-group'

import { Editor } from '@contentkit/editor'
import { setEditorStateBlockMap, Block, Command, HANDLED, NOT_HANDLED } from '@contentkit/util'
import plugins from '@contentkit/editor/lib/plugins'
import { genKey, ContentBlock } from 'draft-js'
import clsx from 'clsx'
import classes from './styles.scss'

import '@contentkit/editor/lib/css/normalize.css'
import '@contentkit/editor/lib/css/Draft.css'
import '@contentkit/editor/lib/css/prism.css'
import '@contentkit/editor/lib/css/CheckableListItem.css'
import 's3-dropzone/lib/styles.css'
import '@contentkit/code/src/style.scss'
import '../../css/editor/toolbar.scss'

import keyBindingFn from './keyBindingFn'
import ReadOnlyDraftTable from '../ReadOnlyDraftTable'
import LinearProgress from '@material-ui/core/LinearProgress'
import ContentKitEditor from '../ContentKitEditor'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import * as config from '../../lib/config'
import BaseDropzone from '../BaseDropzone'
import { CREATE_IMAGE } from '../../graphql/mutations'

const Toolbar = plugins.toolbar

const awsConfig = {
  identityPoolId: config.IDENTITY_POOL_ID,
  region: config.AWS_REGION,
  bucketName: config.AWS_BUCKET_NAME,
  endpoint: config.AWS_BUCKET_URL + '/'
}

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

function genId () {
  return [...Array(20)].map(i=>(~~(Math.random()*36)).toString(36)).join('')
}

function PostEditorComponent (props) {
  const [tableBlockKey, setTableBlockKey] = React.useState(null)
  const [isDragging, setDrag] = React.useState(false)

  const handleClick = () => {}
  // const handleClick = evt => {
  //   let { clientY } = evt
  //   const { editorState, onChange } = props
  //   const currentContent = editorState.getCurrentContent()
  //   const blockMap = currentContent.getBlockMap()

  //   const last = blockMap.toSeq().last()
  //   if (!last) return

  //   const blockKey = last.getKey()
  //   const elem = document.querySelector(`[data-offset-key="${blockKey}-0-0"]`)
  //   if (!elem) return
  //   const rect = elem.getBoundingClientRect()

  //   if (clientY < rect.bottom) return
  //   const newBlockKey = genKey()

  //   const newBlockMap = blockMap
  //     .set(newBlockKey, new ContentBlock({ key: newBlockKey }))

  //   onChange(
  //     setEditorStateBlockMap(editorState, newBlockMap, newBlockKey)
  //   )
  // }

  const handleOpen = tableBlockKey => {
    setTableBlockKey(tableBlockKey)
  }

  const handleClose = () => {
    setTableBlockKey(null)
  }

  const onDrop = (mutate) => async (files, event) => {
    setDrag(false)
    const { client, users, posts: { data: { posts } } } = props

    const postId = posts[0].id
    const userId = users.data.users[0].id
    const [file] = files
    const { name, type, size } = file
    const filename = sanitizeFileName(name)
    const key = `static/${postId}/${filename}`
    const createPresignedPost = await props.getFormData({ key, userId })

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

    props.insertImage(`https://s3.amazonaws.com/contentkit/${key}`)
    console.log(data)
  }

  const {
    editorState,
    deleteImage,
    createImage,
    posts,
    onChange,
    mutate,
    save,
    insertImage,
    loading,
    ...rest /* eslint-disable-line */
  } = props
  console.log({ isDragging })
  return (
    <Mutation mutation={UPLOAD_MUTATION}>
      {upload => {
        return (
          <BaseDropzone className={classes.root} onDrop={onDrop(upload)} setDrag={setDrag}>
            <CSSTransition
              classNames={'transition'}
              unmountOnExit
              timeout={1000}
              in={loading}
            >
              {state => (
                <LinearProgress />
              )}
            </CSSTransition>
            <div className={classes.flex}>
              <div className={clsx(classes.editorContainer, { [classes.drag]: isDragging })} onClick={handleClick}>
                <ContentKitEditor
                  editorState={editorState}
                  onChange={onChange}
                  plugins={plugins}
                  save={props.save}
                />
              </div>
              <div className={classes.toolbar}>
                <div className={classes.toolbarInner}>
                  <Toolbar.Component
                    config={awsConfig}
                    refId={posts?.data?.posts[0]?.id}
                    images={posts?.data?.posts[0]?.images}
                    deleteImage={deleteImage}
                    createImage={createImage}
                    insertImage={insertImage}
                  />
                </div>
              </div>
            </div>
          </BaseDropzone>
        )
      }}
    </Mutation>
  )
}

export default PostEditorComponent
