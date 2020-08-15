import React from 'react'
import PropTypes from 'prop-types'
import { EditorState } from 'draft-js'
import { Divider, IconButton, List, ListItem, Button } from '@material-ui/core'
import { AppWrapper, EditorToolbar } from '@contentkit/components'
import { useQuery, useApolloClient } from '@apollo/client'

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
import usePersistentState from '../../hooks/usePersistentState'
import useLocalStorage from '../../hooks/useLocalStorage'
import useSaveEditorState from '../../hooks/useSaveEditorState'
import useMediaProvider from '../../hooks/useMediaProvider'

import TopBar from '../../components/TopBar'
import paragraph from '../../assets/paragraph.svg'
import pen from '../../assets/pen.svg'
import code from '../../assets/code.svg'

function PostEditor (props) {
  const classes = useStyles(props)
  const client = useApolloClient()

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
    history,
    users,
    posts: {
      data: {
        posts
      }
    },
  } = props

  const postId = posts[0]?.id

  const onSaveRawEditor = (raw: any) => {
    onChange(expandCompressedRawContentBlocks(editorState, raw))
  }

  const onChange = editorState => {
    setEditorState(editorState)
  }
  
  const onToggleDrawer = (key) => (evt) => {
    setOpen({
      ...open,
      [key]: !open[key]
    })
  }

  const raw = posts[0]?.raw


  const onDiscard = (key, rawEditorStateRef) => () => {
    onDismiss(key)
    setEditorState(expandCompressedRawContentBlocks(editorState, rawEditorStateRef.current))
  }

  const [isReady, cancel] = useLocalStorage({ postId, editorState, onDiscard, onChange, raw })

  const mediaProvider = useMediaProvider()

  const getEditorState = () => editorState

  const [saveDocument, loading] = useSaveEditorState(postId)

  const manualSave = async () => {
    await saveDocument(editorState)
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
      mediaProvider={mediaProvider}
      client={client}
    />
  )

  const modalProps = {
    ...props,
    onClose,
    editorState,
    setEditorState,
    getFormData,
    saveDocument,
    onSaveRawEditor,
    mediaProvider
  }

  const sidebarProps = {
    children: (
      <List disablePadding>
        <ListItem disableGutters className={classes.listItem}>
          <IconButton className={classes.iconButton} onClick={onToggleDrawer(ModalType.POSTMETA)}>
            <img src={pen} width='18' />
          </IconButton>
        </ListItem>
        <ListItem disableGutters className={classes.listItem}>
          <IconButton className={classes.iconButton} onClick={onToggleDrawer(ModalType.JSON_EDITOR)}>
            <img src={code} width='18' />
          </IconButton>
        </ListItem>
      </List>
    )
  }

  return (
    <AppWrapper
      renderToolbar={() => <TopBar history={history} onClick={onClick} />}
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
        renderToolbar={renderToolbar}
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
  const componentProps = React.useMemo(() => ({
    posts,
    users,
    createImage,
    deleteImage,
    mediaProviderActions: {
      onDelete: deleteImage,
      onCreate: createImage
    },
    ...props
  }), [posts, users])

  if (posts.loading) {
    return null
  }

  return (
    <PostEditor {...componentProps} />
  )
}

export default EditorWithData
