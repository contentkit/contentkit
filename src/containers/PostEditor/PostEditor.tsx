import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { EditorState } from 'draft-js'
import { Dialog, DialogContent, Snackbar, Button, CircularProgress, Fade } from '@material-ui/core'
import { DeleteForever } from '@material-ui/icons'
import { AppWrapper, Toolbar, MediaProvider } from '@contentkit/components'
import { convertToHTML } from '@contentkit/convert'
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks'
import { makeStyles } from '@material-ui/styles'
import Alert from '@material-ui/lab/Alert'

import { encode } from 'base64-unicode'
import PostEditorToolbar from '../../components/PostEditorToolbar'
import PostEditorComponent from '../../components/PostEditorComponent'
import {
  expandCompressedRawContentBlocks,
  sha256,
  debouncedSaveEditorStateToLocalStorage,
  getCacheKey
} from './util'
import { setEditorState, saveEditorState } from '../../lib/redux'
import { UPLOAD_MUTATION } from '../../graphql/mutations'

import {
  CREATE_IMAGE,
  DELETE_IMAGE,
  UPDATE_DOCUMENT,
  useUpdateDocument,
  useCreateImage,
  useDeleteImage
} from '../../graphql/mutations'
import { POST_QUERY, USER_QUERY } from '../../graphql/queries'
import debounce from 'lodash.debounce'
import invariant from 'fbjs/lib/invariant'
import useStyles from './styles'
import { ModalItem } from '../../types'
import modals from './modals'
import { ModalType } from '../../fixtures'

function PostEditor (props) {
  const client = useApolloClient()
  const [loading, setLoading] = React.useState(false)
  const [snackbarOpen, setSnackbarOpen] = React.useState(false)
  const [isSavingLocally, setIsSavingLocally] = React.useState(false)

  const [open, setOpen] = React.useState({
    [ModalType.HISTORY]: false,
    [ModalType.POSTMETA]: false,
    [ModalType.JSON_EDITOR]: false
  })

  const {
    editorState,
    setEditorState,
    saveEditorState,
    history,
    createImage,
    deleteImage,
    mediaProviderActions,
    logged,
    users,
    posts: {
      data: {
        posts
      }
    }
  } = props

  const postId = posts[0]?.id

  const onSaveRawEditor = (raw: any) => {
    setEditorState(expandCompressedRawContentBlocks(editorState, raw))
  }

  const setLoadingOnLocalSave = () => {
    setIsSavingLocally(true)
  }

  const onChange = editorState => {
    setEditorState(editorState)
    debouncedSaveEditorStateToLocalStorage(editorState, postId, setLoadingOnLocalSave)
  }

  const mediaProvider : React.RefObject<any> = React.useRef(null)
  const rawEditorStateRef = React.useRef(null)

  React.useEffect(() => {
    let rawEditorState = posts[0]?.raw
    rawEditorStateRef.current = rawEditorState
    const localEditorState = window.localStorage.getItem(getCacheKey(postId))

    if (localEditorState) {
      try {
        rawEditorState = JSON.parse(localEditorState)
        setSnackbarOpen(true)
      } catch (err) {
        console.error(err)
      }
    }

    // onSaveRawEditor(editorState, rawEditorState)
    setEditorState(expandCompressedRawContentBlocks(editorState, rawEditorState))
  }, [])

  React.useEffect(() => {
    const config = {
      baseUrl: 'https://s3.amazonaws.com/contentkit/'
    }
    // @ts-ignore
    mediaProvider.current = new MediaProvider(config, client)
  }, [])

  const getEditorState = () => editorState

  const saveDocument = async () => {
    const id = posts[0].id
    await saveEditorState(client, { id })
    setLoading(false)
  }

  const manualSave = async () => {
    setLoading(true)
    await saveDocument()
  }

  const getHtml = (editorState) => {
    return encode(convertToHTML(editorState))
  }

  const onClick = (key: ModalType) => {
    if (!open[key]) {
      setOpen({ ...open, [key]: true })
    }
  }

  const onClose = () => {
    setOpen({
      [ModalType.HISTORY]: false,
      [ModalType.POSTMETA]: false,
      [ModalType.JSON_EDITOR]: false
    })
  }

  const getFormData = async (variables) => {
    const { data: { createPresignedPost } } = await client.mutate({
      mutation: UPLOAD_MUTATION,
      variables
    })
    return createPresignedPost
  }

  const renderToolbar = () => (
    <Toolbar
      onClick={onClick}
      documentId={posts[0]?.id}
      uploads={posts[0]?.images}
      getEditorState={getEditorState}
      setEditorState={setEditorState}
      mediaProvider={mediaProvider.current}
      client={client}
    />
  )

  const onCloseSnackbar = () => {
    setSnackbarOpen(false)
  }

  const onCloseLocalSaveSnackbar = () => {
    setIsSavingLocally(false)
  }
  
  const onClickDiscardChanges = () => {
    window.localStorage.removeItem(getCacheKey(postId, 'state'))
    window.localStorage.removeItem(getCacheKey(postId, 'hash'))
    setEditorState(expandCompressedRawContentBlocks(editorState, rawEditorStateRef.current))
    onCloseSnackbar()
  }

  const getSnackbarProps = () => ({
    open: snackbarOpen,
    message: 'Loading unsaved changes backed up in your browser.',
    autoHideDuration: 6000,
    onClose: onCloseSnackbar,
    action: (
      <Button
        variant='contained'
        startIcon={<DeleteForever />}
        onClick={onClickDiscardChanges}
      >
        Discard Changes
      </Button>
    )
  })

  const modalProps = {
    ...props,
    getFormData,
    saveDocument,
    onSaveRawEditor,
    mediaProvider: mediaProvider.current,
  }

  const sidebarProps = {}
  const classes = useStyles(props)

  return (
    <AppWrapper
      renderToolbar={renderToolbar}
      sidebarProps={sidebarProps}
      classes={{
        content: classes.content
      }}
      disablePadding
    >
      <Snackbar {...getSnackbarProps()} />
        
      {modals.map(({ Component, getComponentProps, name }) => {
        return (
          <Component key={name} {...getComponentProps(modalProps)} open={open[name]} onClose={onClose} />
        )
      })}
      <PostEditorComponent
        onChange={onChange}
        editorState={editorState}
        save={manualSave}
        loading={loading}
        getFormData={getFormData}
        posts={posts}
        users={users}
      />

      <Snackbar open={isSavingLocally} autoHideDuration={2000} onClose={onCloseLocalSaveSnackbar}>
        <Alert onClose={onCloseLocalSaveSnackbar} severity="success">
          This is a success message!
        </Alert>
      </Snackbar>
      
    </AppWrapper>
  )
}

PostEditor.propTypes = {
  history: PropTypes.object.isRequired,
  editorState: PropTypes.object,
  setEditorState: PropTypes.func,
  logged: PropTypes.bool,
  updatePost: PropTypes.func
}

const mapStateToProps = state => state.app

const mapDispatchToProps = { setEditorState, saveEditorState }

function PostEditorMutations (props: any) {
  const createImage = useCreateImage()
  const deleteImage = useDeleteImage()
  const componentProps = {
    createImage,
    deleteImage,
    mediaProviderActions: {
      onDelete: deleteImage,
      onCreate: createImage
    },
    ...props
  }
  return (<PostEditor {...componentProps} />)
}

function EditorWithData (props) {
  const client = useApolloClient()
  const { children, match: { params: { id } } } = props
  const posts = useQuery(POST_QUERY, { variables: { id }, client })
  const users = useQuery(USER_QUERY)

  if (posts.loading) {
    return null
  }

  return (
    <PostEditorMutations {...props} posts={posts} users={users} client={client} />
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorWithData)
