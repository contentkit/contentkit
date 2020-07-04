import React from 'react'
import { ModalType } from '../../fixtures'
import { ModalItem } from '../../types'
import PostEditorHistoryModal from '../../components/PostEditorHistoryModal'
import { JsonEditorModal } from '@contentkit/json-editor'
import Drawer from '../../components/Drawer'

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
    Component: Drawer,
    getComponentProps: ({ users, posts, createImage, deleteImage, getFormData, mediaProvider }) => ({
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
    getComponentProps: ({ editorState, onSaveRawEditor, onClose }) => ({
      editorState,
      onClose,
      onSave: onSaveRawEditor
    })
  }
]

export default modals
