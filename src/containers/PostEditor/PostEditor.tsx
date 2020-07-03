import React from 'react'
import PropTypes from 'prop-types'
import { EditorState } from 'draft-js'
import { Button } from '@material-ui/core'
import { DeleteForever } from '@material-ui/icons'
import { AppWrapper, EditorToolbar, MediaProvider } from '@contentkit/components'
import { useQuery, useApolloClient } from '@apollo/client'
import { expand } from 'draft-js-compact'
import { useDebounce } from 'react-use'
import { useSnackbar } from 'notistack'

import PostEditorComponent from '../../components/PostEditorComponent'
import {
  expandCompressedRawContentBlocks
} from '../../store/utils'
import { UPLOAD_MUTATION } from '../../graphql/mutations'
import {
  useCreateImage,
  useDeleteImage
} from '../../graphql/mutations'
import { POST_QUERY, USER_QUERY } from '../../graphql/queries'
import useStyles from './styles'
import modals from './modals'
import { ModalType } from '../../fixtures'
import EditorCache from '../../store/EditorCache'
import { AWS_BUCKET_URL } from '../../lib/config'
import usePersistentState from '../../hooks/usePersistentState'
import TopBar from '../../components/TopBar'

function PostEditor (props) {
  const client = useApolloClient()
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = React.useState(false)
  const [snackbarOpen, setSnackbarOpen] = React.useState(false)
  const [open, setOpen] = React.useState({
    [ModalType.HISTORY]: false,
    [ModalType.POSTMETA]: false,
    [ModalType.JSON_EDITOR]: false
  })
  const [state, setState] = usePersistentState('editorState', { editorState: EditorState.createEmpty() })
  
  const setEditorState = editorState => setState({ editorState })

  const { editorState } = state

  const {
    onDismiss,
    localRawEditorState,
    setStatus,
    saveEditorState,
    saveEditorStateLocally,
    discardLocalEditorState,
    history,
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
  const raw = posts[0]?.raw

  useDebounce(() => {
    saveEditorStateLocally(editorState)
  }, 3000, [editorState])

  React.useEffect(() => {
    if (!raw) {
      return
    }
    if (rawEditorStateRef.current) {
      return
    }
    let rawEditorState = expand(posts[0]?.raw)
    const editorCache = new EditorCache({ id: postId })
    EditorCache.hash(JSON.stringify(rawEditorState)).then(hash => {
      rawEditorStateRef.current = rawEditorState
    
      if (localRawEditorState && hash !== editorCache.getHash()) {
        rawEditorState = localRawEditorState
        setSnackbarOpen(true)
      }

      onChange(expandCompressedRawContentBlocks(editorState, rawEditorState))
    })
  }, [raw])

  React.useEffect(() => {
    const config = {
      baseUrl: `${AWS_BUCKET_URL}/`
    }
    // @ts-ignore
    mediaProvider.current = new MediaProvider(config, client)
  }, [])

  const getEditorState = () => editorState

  const saveDocument = async () => {
    const id = posts[0].id
    await saveEditorState({ editorState, id })
    setLoading(false)
  }

  const manualSave = async () => {
    setLoading(true)
    await saveDocument()
  }

  const onClick = ({ key }: { key: ModalType }) => {
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
    <EditorToolbar
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
  
  const onClickDiscardChanges = key => () => {
    onDismiss(key)
    discardLocalEditorState()
    setEditorState(expandCompressedRawContentBlocks(editorState, rawEditorStateRef.current))
    onCloseSnackbar()
  }

  const modalProps = {
    ...props,
    onClose,
    editorState,
    setEditorState,
    getFormData,
    saveDocument,
    onSaveRawEditor,
    mediaProvider: mediaProvider.current,
  }

  const sidebarProps = {
    children: renderToolbar()
  }
  const classes = useStyles(props)

  const buttons = [
    {
      key: 'history',
      label: 'History',
    },
    {
      key: 'postmeta',
      label: 'Postmeta'
    },
    {
      key: 'json-editor',
      label: 'Raw'
    }
  ]

  React.useEffect(() => {
    if (snackbarOpen) {
      enqueueSnackbar('Loading unsaved changes backed up in your browser.', {
        variant: 'info',
        action: key => (
          <Button
            variant='text'
            startIcon={<DeleteForever />}
            onClick={onClickDiscardChanges(key)}
            className={classes.button}
          >
            Discard Changes
          </Button>
        )
      })
    }
  }, [snackbarOpen])

  React.useEffect(() => {
    if (status.isSavingLocally && !snackbarOpen) {
      enqueueSnackbar('Saved locally', {
        variant: 'success',
        autoHideDuration: 1000,
        persist: false,
        preventDuplicate: true
      })
    }
  }, [status])
  return (
    <AppWrapper
      renderToolbar={() => <TopBar history={history} buttons={buttons} onClick={onClick} />}
      sidebarProps={sidebarProps}
      classes={{
        content: classes.content
      }}
      disablePadding
    >
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

function EditorWithData (props) {
  const client = useApolloClient()
  const { children, match: { params: { id } } } = props
  const posts = useQuery(POST_QUERY, { variables: { id }, client })
  const users = useQuery(USER_QUERY)
  const createImage = useCreateImage()
  const deleteImage = useDeleteImage()
  const componentProps = {
    posts,
    users,
    createImage,
    deleteImage,
    mediaProviderActions: {
      onDelete: deleteImage,
      onCreate: createImage
    },
    ...props
  }

  if (posts.loading) {
    return null
  }

  return (
    <PostEditor {...componentProps} />
  )
}

export default EditorWithData
