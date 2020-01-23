import {
  UPDATE_FEED_VARIABLES,
  SET_EDITOR_STATE,
  SELECT_POST,
  SET_SEARCH_QUERY,
  SET_SEARCH_LOADING_STATE,
  SAVE_EDITOR_SATE,
  SET_STATUS
} from './fixtures'
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js'
import { compress, expand } from 'draft-js-compact'
import { getUpdateDocumentMutationOptions } from '../graphql/mutations'
import { convertToHTML } from '@contentkit/convert'
import { encode } from 'base64-unicode'
import EditorCache from './EditorCache'
import { getCurrentPostId } from './selectors'

export const updateFeedVariables = payload => ({
  type: UPDATE_FEED_VARIABLES,
  payload
})

export const setEditorState = (editorState) => ({
  payload: {
    editorState,
  },
  type: SET_EDITOR_STATE
})

export const setSelectedProjectId = (projectId) => ({
  payload: {
    projectId
  },
  type: UPDATE_FEED_VARIABLES
})

export const setSelectedPostIds = (selectedPostIds) => ({
  type: SELECT_POST,
  payload: {
    selectedPostIds
  }
})

export const setSearchQuery = payload => ({
  type: SET_SEARCH_QUERY,
  payload
})

export const setSearchLoadingState = payload => ({
  type: SET_SEARCH_LOADING_STATE,
  payload
})

export const toRaw = (editorState: EditorState) => {
  return compress(convertToRaw(editorState.getCurrentContent()))
}

export const fromRaw = (raw: any): EditorState => {
  return EditorState.createWithContent(
    convertFromRaw(expand(raw))
  )
}

export const saveEditorState = (client, { id }) => async (dispatch, getState) => {
  const state = getState()
  const raw = toRaw(state.app.editorState)
  const html = encode(convertToHTML(state.app.editorState))
  const options = getUpdateDocumentMutationOptions(client, {
    id: id,
    raw: raw,
    encodedHtml: html
  })
  await client.mutate(options)
  EditorCache.create(id).clear()
}

export const saveEditorStateLocally = () => (dispatch, getState) => {
  const state = getState()
  const id = getCurrentPostId(state)
  EditorCache.create(id).save(state.app.editorState)
  dispatch(setStatus({ isSavingLocally: true }))
}

export const discardLocalEditorState = (editorState) => (dispatch, getState) => {
  const state = getState()
  const id = getCurrentPostId(state)
  EditorCache.create(id).clear()
  dispatch(setEditorState(editorState))
}

export const setStatus = payload => ({
  payload,
  type: SET_STATUS
})

export const actions = {
  updateFeedVariables,
  setSelectedProjectId,
  setSelectedPostIds,
  setSearchQuery,
  setSearchLoadingState,
  
  setEditorState,
  saveEditorState,
  saveEditorStateLocally,
  discardLocalEditorState,
  setStatus
}