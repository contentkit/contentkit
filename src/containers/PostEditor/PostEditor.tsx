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
import { expand } from 'draft-js-compact'
import { encode } from 'base64-unicode'
import PostEditorToolbar from '../../components/PostEditorToolbar'
import PostEditorComponent from '../../components/PostEditorComponent'
import {
  expandCompressedRawContentBlocks
} from './util'
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
import EditorCache from '../../store/EditorCache'

function PostEditor (props) {
  const client = useApolloClient()
  const [loading, setLoading] = React.useState(false)
  const [snackbarOpen, setSnackbarOpen] = React.useState(false)

  const [open, setOpen] = React.useState({
    [ModalType.HISTORY]: false,
    [ModalType.POSTMETA]: false,
    [ModalType.JSON_EDITOR]: false
  })

  const {
    editorState,
    localRawEditorState,
    setEditorState,
    setStatus,
    saveEditorState,
    history,
    createImage,
    deleteImage,
    mediaProviderActions,
    discardLocalEditorState,
    logged,
    users,
    posts: {
      data: {
        posts
      }
    },
    status
  } = props

  const postId = posts[0]?.id

  const onSaveRawEditor = (raw: any) => {
    onChange(expandCompressedRawContentBlocks(editorState, raw))
  }

  const onChange = editorState => {
    setEditorState(editorState)
  }

  const mediaProvider : React.RefObject<any> = React.useRef(null)
  const rawEditorStateRef = React.useRef(null)

  React.useEffect(() => {
    let rawEditorState = expand(posts[0]?.raw)
    const editorCache = new EditorCache({ id: postId })
    const hash = EditorCache.hash(JSON.stringify(rawEditorState))
    rawEditorStateRef.current = rawEditorState

    if (localRawEditorState && editorCache.getHash() !== hash) {
      rawEditorState = localRawEditorState
      setSnackbarOpen(true)
    }

    onChange(expandCompressedRawContentBlocks(editorState, rawEditorState))
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
      setEditorState={onChange}
      mediaProvider={mediaProvider.current}
      client={client}
    />
  )

  const onCloseSnackbar = () => {
    setSnackbarOpen(false)
  }

  const onCloseLocalSaveSnackbar = () => {
    setStatus({ isSavingLocally: false })
  }
  
  const onClickDiscardChanges = () => {
    // window.localStorage.removeItem(getCacheKey(postId, 'state'))
    // window.localStorage.removeItem(getCacheKey(postId, 'hash'))
    discardLocalEditorState(expandCompressedRawContentBlocks(editorState, rawEditorStateRef.current))
    // setEditorState(expandCompressedRawContentBlocks(editorState, rawEditorStateRef.current))
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

      <Snackbar
        open={status.isSavingLocally}
        autoHideDuration={2000}
        onClose={onCloseLocalSaveSnackbar}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
      >
        <Alert onClose={onCloseLocalSaveSnackbar} severity="success">
          Saved locally
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

export default EditorWithData
