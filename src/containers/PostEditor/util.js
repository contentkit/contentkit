// @flow

import { EditorState, convertFromRaw, convertToRaw } from 'draft-js'
import { exportHtml } from '@contentkit/editor'
import { expand, compress } from 'draft-js-compact'

export const convertToHtml = editorState => {
  const html = exportHtml(editorState)
  return window.btoa(html)
}

export const isLoaded = ({ post }) => Boolean(post && post.Post)

export const toRaw = editorState => {
  return compress(convertToRaw(editorState.getCurrentContent()))
}

export const fromRaw = raw => {
  return EditorState.createWithContent(
    convertFromRaw(expand(raw))
  )
}

export const hydrate = ({ editorState, post }) => (
  fromRaw(post.data.post.document.raw)
)
