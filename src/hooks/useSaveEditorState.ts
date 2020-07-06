import React from 'react'
import { convertToHTML } from '@contentkit/convert'
import { convertToRaw, EditorState } from 'draft-js'
import { compress } from 'draft-js-compact'
import { encode } from 'base64-unicode'

import EditorCache from '../store/EditorCache'
import apolloClient from '../lib/client'
import { getUpdateDocumentMutationOptions } from '../graphql/mutations'


export const toRaw = (editorState: EditorState) => {
  return compress(convertToRaw(editorState.getCurrentContent()))
}

function useSaveEditorState (id): [(editorState: EditorState) => Promise<void>, boolean] {
  const [loading, setLoading] = React.useState(false)

  const save = async (editorState: EditorState): Promise<void> => {
    setLoading(true)
    const raw = toRaw(editorState)
    const html = encode(convertToHTML(editorState))
    const options = getUpdateDocumentMutationOptions(apolloClient, {
      id: id,
      raw: raw,
      encodedHtml: html
    })
    await apolloClient.mutate(options)
    EditorCache.create(id).clear()
    setLoading(false)
  }

  return [save, loading]
}

export default useSaveEditorState
