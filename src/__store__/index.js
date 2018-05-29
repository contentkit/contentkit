import store from './store'
import * as actions from './actions'

export const withStore = store.withStore
export const actionDispatcher = store.actionDispatcher

export const updateVariables = actions.updateVariables
export const selectPost = actions.selectPost
export const updatePostTitle = actions.updatePostTitle
export const updateProject = actions.updateProject

// editor
export const hydratePostEditor = actions.hydratePostEditor
export const updateStatus = actions.updateStatus
export const dispatch = actions.dispatch
export const updateEditorState = actions.updateEditorState
