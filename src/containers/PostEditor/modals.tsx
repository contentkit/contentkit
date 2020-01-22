import React from 'react'
import { ModalType } from '../../fixtures'
import { ModalItem } from '../../types'
import PostEditorHistoryModal from '../../components/PostEditorHistoryModal'
import PostMetaModal from '../../components/PostEditorMetaModal'
import { JsonEditorModal } from '@contentkit/json-editor'

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
  },
  {
    name: ModalType.JSON_EDITOR,
    Component: JsonEditorModal,
    getComponentProps: ({ editorState, onSaveRawEditor }) => ({
      editorState,
      onSave: onSaveRawEditor
    })
  }
]

export default modals
