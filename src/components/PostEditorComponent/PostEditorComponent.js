import React from 'react'
import { CSSTransition } from 'react-transition-group'

import { Editor } from '@contentkit/editor'
import { setEditorStateBlockMap, Block, Command, HANDLED, NOT_HANDLED } from '@contentkit/util'
import { genKey, ContentBlock } from 'draft-js'
import clsx from 'clsx'
import classes from './styles.scss'

import '@contentkit/editor/src/css/Draft.css'
import '@contentkit/editor/src/css/prism.css'
import '@contentkit/editor/src/css/CheckableListItem.css'
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
import { plugins } from './plugins'
import Toolbar from './Toolbar'

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

class PostEditorComponent extends React.Component {

  constructor (props) {
    super (props)

    this.state = {
      tableBlockKey: null,
      isDragging: false
    }
  }

  handleClick = () => {}
  
  handleOpen = tableBlockKey => {
    setState({ tableBlockKey })
  }

  handleClose = () => {
    setState({ tableBlockKey: null })
  }

  setDrag = isDragging => this.setState({ isDragging })

  onDrop = (mutate) => async (files, event) => {
    this.setDrag(false)
    const { client, users, posts: { data: { posts } } } = this.props

    const postId = posts[0].id
    const userId = users.data.users[0].id
    const [file] = files
    const { name, type, size } = file
    const filename = sanitizeFileName(name)
    const key = `static/${postId}/${filename}`
    const createPresignedPost = await this.props.getFormData({ key, userId })

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

    this.props.insertImage(`https://s3.amazonaws.com/contentkit/${key}`)
  }

  render () {
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
    } = this.props
    const { isDragging, tableBlockKey } = this.state
    return (
      <Mutation mutation={UPLOAD_MUTATION}>
        {upload => {
          return (
            <BaseDropzone className={classes.root} onDrop={this.onDrop(upload)} setDrag={this.setDrag}>
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
                <ContentKitEditor
                  editorState={editorState}
                  onChange={onChange}
                  plugins={plugins}
                  save={this.props.save}
                  classes={{
                    editor: 'monograph-editor',
                    root: clsx('ck-editorContainer', classes.editorContainer, { [classes.drag]: isDragging })
                  }}
                  onClick={this.handleClick}
                  renderToolbar={store => {
                    return (
                      <div className={clsx(classes.toolbar, 'ck-toolbar')}>
                        <div className={classes.toolbarInner}>
                          <Toolbar
                            config={awsConfig}
                            refId={posts?.data?.posts[0]?.id}
                            images={posts?.data?.posts[0]?.images}
                            deleteImage={deleteImage}
                            createImage={createImage}
                            insertImage={insertImage}
                            store={store}
                          />
                        </div>
                      </div>
                    )
                  }}
                />
              </div>
            </BaseDropzone>
          )
        }}
      </Mutation>
    )
  }
}

export default PostEditorComponent
