import { actionDispatcher } from './store'
import {
  UPDATE_VARIABLES,
  SELECT_POST,
  UPDATE_POST_TITLE,
  UPDATE_PROJECT,
  HYDRATE_EDITOR_STATE,
  UPDATE_STATUS,
  DISPATCH,
  UPDATE_EDITOR_STATE,
  SET_DIALOG_STATE
} from './types'

// app
export const updateVariables = actionDispatcher(payload => ({
  payload,
  type: UPDATE_VARIABLES
}))

export const selectPost = actionDispatcher(payload => ({
  payload,
  type: SELECT_POST
}))

export const updatePostTitle = actionDispatcher(payload => ({
  payload,
  type: UPDATE_POST_TITLE
}))

export const updateProject = actionDispatcher(payload => ({
  payload,
  type: UPDATE_PROJECT
}))

// editor
export const hydratePostEditor = actionDispatcher((payload) => ({
  type: HYDRATE_EDITOR_STATE,
  payload,
  key: 'editor'
}))

export const updateStatus = actionDispatcher(payload => ({
  type: UPDATE_STATUS,
  payload
}))

export const dispatch = actionDispatcher(payload => ({
  type: DISPATCH,
  payload
}))

export const updateEditorState = actionDispatcher(payload => ({
  type: UPDATE_EDITOR_STATE,
  payload
}))

export const setDialogState = actionDispatcher(payload => ({
  type: SET_DIALOG_STATE,
  payload
}))
