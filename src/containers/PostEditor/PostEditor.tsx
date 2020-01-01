import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { AppWrapper, Toolbar, MediaProvider } from '@contentkit/components'
import { convertToHTML } from '@contentkit/convert'
import insertImage from '@contentkit/editor/lib/modifiers/insertImage'

import { encode } from '../../lib/utf8'
import PostEditorToolbar from '../../components/PostEditorToolbar'
import PostEditorComponent from '../../components/PostEditorComponent'
import {
  hydrate,
  toRaw,
} from './util'
import { setEditorState, saveEditorState } from '../../lib/redux'
import { UPLOAD_MUTATION } from '../../graphql/mutations'
import PostEditorHistoryModal from '../../components/PostEditorHistoryModal'
import PostMetaModal from '../../components/PostEditorMetaModal'
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks'
import {
  CREATE_IMAGE,
  DELETE_IMAGE,
  UPDATE_DOCUMENT,
  useUpdateDocument,
  useCreateImage,
  useDeleteImage
} from '../../graphql/mutations'
import { POST_QUERY, USER_QUERY } from '../../graphql/queries'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
  content: {
    backgroundColor: '#f5f5f5'
  }
}))

export enum ModalType {
  HISTORY = 'history',
  POSTMETA = 'postmeta'
}

type ModalItem = {
  name: ModalType,
  Component: any,
  getComponentProps: (props: any) => any
}

export const modals : ModalItem[] = [
  {
    name: ModalType.HISTORY,
    Component: PostEditorHistoryModal,
    getComponentProps: ({ posts, saveDocument, editorState, setEditorState }) => ({
      posts,
      saveDocument,
      editorState,
      setEditorState
    })
  },
  {
    name: ModalType.POSTMETA,
    Component: PostMetaModal,
    getComponentProps: ({ users, client, posts, createImage, deleteImage, getFormData, mediaProvider }) => ({
      users,
      posts,
      createImage,
      deleteImage,
      getFormData,
      mediaProvider
    })
  }
]

function PostEditor (props) {
  const client = useApolloClient()
  const editorRef = React.createRef()
  const [loading, setLoading] = React.useState(false)
  const [open, setOpen] = React.useState({
    [ModalType.HISTORY]: false,
    [ModalType.POSTMETA]: false
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
  const mediaProvider : React.RefObject<any> = React.useRef(null)

  React.useEffect(() => {
    setEditorState(hydrate(editorState, posts[0]?.raw))
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

  const onChange = editorState => {
    setEditorState(editorState)
  }

  const onClick = (key: ModalType) => {
    if (!open[key]) {
      setOpen({ ...open, [key]: true })
    }
  }

  const onClose = () => {
    setOpen({
      [ModalType.HISTORY]: false,
      [ModalType.POSTMETA]: false
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

  const modalProps = {
    ...props,
    getFormData,
    saveDocument,
    mediaProvider: mediaProvider.current
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
        editorRef={editorRef}
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
  hydrated: PropTypes.bool,
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
