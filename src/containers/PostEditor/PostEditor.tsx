import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { AppWrapper, Toolbar } from '@contentkit/components'
import { convertToHTML } from '@contentkit/convert'
import insertImage from '@contentkit/editor/lib/modifiers/insertImage'

import { encode } from '../../lib/utf8'
import PostEditorToolbar from '../../components/PostEditorToolbar'
import PostEditorComponent from '../../components/PostEditorComponent'
import {
  hydrate,
  toRaw,
} from './util'
import { setEditorState } from '../../lib/redux'
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
import { POST_QUERY } from '../../graphql/queries'

export enum ModalType {
  HISTORY = 'history',
  POSTMETA = 'postmeta'
}

export const modals = [
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
    getComponentProps: ({ users, client, posts, createImage, deleteImage, getFormData }) => ({
      users,
      client,
      posts,
      createImage,
      deleteImage,
      getFormData
    })
  }
]

function PostEditor (props) {
  const editorRef = React.createRef()
  const [loading, setLoading] = React.useState(false)
  const [open, setOpen] = React.useState({
    [ModalType.HISTORY]: false,
    [ModalType.POSTMETA]: false
  })

  const {
    editorState,
    setEditorState,
    client,
    history,
    updateDocument,
    createImage,
    deleteImage,
    logged,
    users,
    posts: {
      data: {
        posts
      }
    }
  } = props

  React.useEffect(() => {
    setEditorState(hydrate(editorState, posts[0]?.raw))
  }, [])

  const getEditorState = () => editorState

  const saveDocument = async ({ editorState }) => {
    const raw = toRaw(editorState)
    const html = encode(convertToHTML(editorState))
    const data = await updateDocument.mutate({
      id: posts[0].id,
      raw: raw,
      encodedHtml: html
    })

    setLoading(false)

    return data
  }

  const manualSave = async () => {
    setLoading(true)
    await saveDocument({ editorState })
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
      history: false,
      postmeta: false
    })
  }

  const getFormData = async (variables) => {
    const { data: { createPresignedPost } } = await client.mutate({
      mutation: UPLOAD_MUTATION,
      variables
    })
    return createPresignedPost
  }

  const addImage = (src: string) => {
    setEditorState(insertImage(editorState, src))
  }

  const renderToolbar = () => (
    <Toolbar
      onClick={onClick}
      // uploads={this.props.posts?.data?.posts[0]?.images}
      uploads={[]}
      getEditorState={getEditorState}
      setEditorState={setEditorState}
      client={client}
    />
  )

  const modalProps = {
    ...props,
    getFormData,
    saveDocument,
    insertImage: addImage
  }

  const sidebarProps = {
    history,
    client,
    logged
  }
  return (
    <AppWrapper
      renderToolbar={renderToolbar}
      sidebarProps={sidebarProps}
    >
      {modals.map(({ Component, getComponentProps, name }) => {
        return (
          <Component {...getComponentProps(modalProps)} open={open[name]} onClose={onClose} />
        )
      })}
      <PostEditorComponent
        onChange={onChange}
        editorState={editorState}
        save={manualSave}
        insertImage={insertImage}
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
  updateDocument: PropTypes.object,
  updatePost: PropTypes.func
}

const mapStateToProps = state => state.app

const mapDispatchToProps = { setEditorState }

function PostEditorMutations (props: any) {
  const { posts, client } = props
  const createImage = useCreateImage()
  const deleteImage = useDeleteImage()
  const updateDocument = useUpdateDocument()
  const componentProps = {
    createImage,
    deleteImage,
    updateDocument,
    ...props
  }
  return (<PostEditor {...componentProps} />)
}

function EditorWithData (props) {
  const client = useApolloClient()
  const { children, match: { params: { id } } } = props
  const posts = useQuery(POST_QUERY, { variables: { id }, client })

  if (posts.loading) {
    return null
  }

  return (
    <PostEditorMutations {...props} posts={posts} client={client} />
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorWithData)
