// @flow
import { EditorState, convertFromRaw } from 'draft-js'
import { exportHtml, convertToRaw } from 'monograph'
import escapeHtml from 'lodash.escape'
import { expand, compress } from 'draft-js-compact'

export const convertToHtml = editorState =>
  escapeHtml(exportHtml(editorState))

export const isLoaded = ({ post }) => Boolean(post && post.Post)

export const toRaw = editorState => compress(
  convertToRaw(editorState.getCurrentContent())
)

export const fromRaw = raw => EditorState.createWithContent(
  convertFromRaw(expand(raw))
)

export const hydrate = ({ editorState, post }) => (
  fromRaw(post.data.post.document.raw)
)
