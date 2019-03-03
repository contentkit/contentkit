// @flow
import * as redux from 'redux'
import { EditorState } from 'draft-js'

const initialState = {
  editorState: EditorState.createEmpty(),
  hydrated: false,
  selectedProject: undefined
}

export const SET_EDITOR_STATE = 'SET_EDITOR_STATE'
export const SELECT_PROJECT = 'SELECT_PROJECT'
export const SELECT_POST = 'SELECT_POST'

export const reducer = (state, action) => {
  switch (action.type) {
    case SET_EDITOR_STATE:
      return { ...state, ...action.payload }
    case SELECT_POST:
      return { ...state, ...action.payload }
    case SELECT_PROJECT:
      return { ...state, ...action.payload }
    default:
      return state
  }
}

export const setEditorState = (editorState) => ({
  payload: {
    editorState,
    hydrated: true
  },
  type: SET_EDITOR_STATE
})

export const selectProject = (selectedProject) => ({
  payload: {
    selectedProject
  },
  type: SELECT_PROJECT
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
  : redux.compose

const middleware = []

const enhancer = composeEnhancers(
  redux.applyMiddleware(...middleware)
)

export const store = redux.createStore(reducer, initialState, enhancer)
