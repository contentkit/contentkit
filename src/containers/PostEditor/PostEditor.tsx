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
import withData from './withData'
import { UPLOAD_MUTATION } from '../../graphql/mutations'
import PostEditorHistoryModal from '../../components/PostEditorHistoryModal'
import PostMetaModal from '../../components/PostEditorMetaModal'
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks'
import {
  CREATE_IMAGE,
  DELETE_IMAGE,
  UPDATE_DOCUMENT
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
  const [createImageMutation] = useMutation(CREATE_IMAGE, { client })
  const [deleteImageMutation] = useMutation(DELETE_IMAGE, { client })
  const [updateDocumentMutation, updateDocumentData] = useMutation(UPDATE_DOCUMENT, { client })

  const createImage = variables => createImageMutation({
    variables,
    optimisticResponse: {
      __typename: 'Mutation',
      insert_images: {
        __typename: 'images_mutation_response',
        returning: [{
          __typename: 'Image',
          id: variables.url,
          ...variables
        }]
      }
    },
    update: (store, { data: { insert_images } }) => {
      store.writeQuery({
        query: POST_QUERY,
        data: {
          posts: [{
            ...posts.data.posts[0],
            images: [...posts.data.posts[0].images].concat(insert_images.returning)
          }]
        },
        variables: posts.variables
      })
    }
  })

  const deleteImage = variables => deleteImageMutation({
    variables,
    optimisticResponse: {
      __typename: 'Mutation',
      delete_images: {
        __typename: 'images_mutation_response',
        response: [{
          __typename: 'Image',
          ...variables
        }]
      }
    },
    update: (store, { data: { delete_images } }) => {
      store.writeQuery({
        query: POST_QUERY,
        data: {
          posts: [{
            ...posts.data.posts[0],
            images: posts.data.posts[0].images.filter(img => img.id !== variables.id)
          }]
        },
        variables: posts.variables
      })
    }
  })

  const updateDocument = variables => updateDocumentMutation({
    variables,
    optimisticResponse: {
      __typename: 'Mutation',
      update_posts: {
        __typename: 'posts_mutation_response',
        returning: [{
          __typename: 'Post',
          ...posts.data.posts[0],
          ...variables
        }]
      }
    },
    update: (store, { data: { update_posts } }) => {
      const data = {
        query: POST_QUERY,
        variables: { id: posts.data.posts[0].id },
        data: {
          posts: [{
            ...posts.data.posts[0],
            ...update_posts.returning[0]
          }]
        }
      }
      store.writeQuery(data)
    }
  })

  const componentProps = {
    ...props,

    updateDocument: {
      mutate: updateDocument,
      ...updateDocumentData
    },
    createImage,
    deleteImage
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
