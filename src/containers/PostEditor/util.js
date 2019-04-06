// @flow

import { EditorState, convertFromRaw, convertToRaw } from 'draft-js'
import { exportHtml } from '@contentkit/editor'
import escapeHtml from 'lodash.escape'
import { expand, compress } from 'draft-js-compact'
import { List } from 'immutable'

export const convertToHtml = editorState => {
  const html = exportHtml(editorState)
  console.log(html)
  return escapeHtml(html)
}

export const isLoaded = ({ post }) => Boolean(post && post.Post)

export const toRaw = editorState => {
  const raw = convertToRaw(editorState.getCurrentContent())
  const c = compress(raw)
  console.log({ c, raw })
  return c
}

export const fromRaw = raw => {
  console.log({ raw })
  const expandedRaw = expand(raw, { parent: null, prevSibling: null, nextSibling: null, children: List() })
  console.log(expandedRaw)
  return EditorState.createWithContent(
    convertFromRaw(expandedRaw)
  )
}

export const hydrate = ({ editorState, post }) => (
  fromRaw(post.data.post.document.raw)
)
