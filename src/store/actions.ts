import {
  UPDATE_FEED_VARIABLES,
  SELECT_POST,
  SET_SEARCH_QUERY,
  SET_SEARCH_LOADING_STATE,
  SET_STATUS
} from './fixtures'
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js'
import { compress, expand } from 'draft-js-compact'
import { getUpdateDocumentMutationOptions } from '../graphql/mutations'
import { convertToHTML } from '@contentkit/convert'
import { encode } from 'base64-unicode'
import EditorCache from './EditorCache'
import { getCurrentPostId } from './selectors'
import apolloClient from '../lib/client'

export const updateFeedVariables = payload => ({
  type: UPDATE_FEED_VARIABLES,
  payload
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

export const saveEditorState = ({ editorState, id }) => async (dispatch, getState) => {
  const raw = toRaw(editorState)
  const html = encode(convertToHTML(editorState))
  const options = getUpdateDocumentMutationOptions(apolloClient, {
    id: id,
    raw: raw,
    encodedHtml: html
  })
  await apolloClient.mutate(options)
  EditorCache.create(id).clear()
}

export const saveEditorStateLocally = (editorState) => (dispatch, getState) => {
  const state = getState()
  const id = getCurrentPostId(state)
  EditorCache.create(id).save(editorState)
  dispatch(setStatus({ isSavingLocally: true }))
}

export const discardLocalEditorState = () => (dispatch, getState) => {
  const state = getState()
  const id = getCurrentPostId(state)
  EditorCache.create(id).clear()
}

export const setStatus = payload => ({
  payload,
  type: SET_STATUS
})

export const actions = {
  updateFeedVariables,
  setSelectedProjectId,
  setSelectedPostIds,
  setSearchLoadingState,
  
  saveEditorState,
  saveEditorStateLocally,
  discardLocalEditorState,
  setStatus
}