import * as redux from 'redux'
import { EditorState, convertFromRaw, convertToRaw, genKey } from 'draft-js'
import { expand, compress } from 'draft-js-compact'
import { connectRouter } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import thunk from 'redux-thunk'
import { encode } from 'base64-unicode'
import { convertToHTML } from '@contentkit/convert'
import { getUpdateDocumentMutationOptions } from '../graphql/mutations'

const history = createBrowserHistory()
const initialState = {
  search: {
    query: '',
    loading: false
  },
  postsAggregateVariables: {
    limit: 10,
    offset: 0,
    query: '',
    projectId: undefined
  },
  editorState: EditorState.createEmpty(),
  selectedProjectId: null,
  selectedPostIds: []
}

export const SET_EDITOR_STATE = 'SET_EDITOR_STATE'
export const SELECT_PROJECT = 'SELECT_PROJECT'
export const SELECT_POST = 'SELECT_POST'
export const SET_SEARCH_QUERY = 'SET_SEARCH_QUERY'
export const SET_SEARCH_LOADING_STATE = 'SET_SEARCH_LOADING_STATE'
export const UPDATE_FEED_VARIABLES = 'UPDATE_FEED_VARIABLES'

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_EDITOR_STATE:
      return { ...state, ...action.payload }
    case SELECT_POST:
      return { ...state, ...action.payload }
    case SELECT_PROJECT:
      return { ...state, ...action.payload }
    case SET_SEARCH_QUERY:
      return {
        ...state,
        search: {
          ...state.search,
          loading: true,
          query: action.payload
        }
      }
    case SET_SEARCH_LOADING_STATE:
      return {
        ...state,
        search: {
          ...state.search,
          loading: action.payload
        }
      }
    case UPDATE_FEED_VARIABLES:
      return {
        ...state,
        postsAggregateVariables: {
          ...state.postsAggregateVariables,
          ...action.payload
        }
      }
    default:
      return state
  }
}

export const updateFeedVariables = payload => ({
  type: UPDATE_FEED_VARIABLES,
  payload
})

export const setEditorState = (editorState) => ({
  payload: {
    editorState
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
  const variables = {
    id: id,
    raw: raw,
    encodedHtml: html
  }
  const options = getUpdateDocumentMutationOptions(client, variables)
  await client.mutate(options)
}

export const actions = {
  updateFeedVariables,
  setEditorState,
  setSelectedProjectId,
  setSelectedPostIds,
  setSearchQuery,
  setSearchLoadingState,
  saveEditorState
}

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
  : redux.compose

const middleware = [thunk]

const combinedReducer = redux.combineReducers({
  app: reducer,
  router: connectRouter(history)
})

const enhancer = composeEnhancers(
  redux.applyMiddleware(...middleware)
)

export const store = redux.createStore(combinedReducer, { app: initialState }, enhancer)
