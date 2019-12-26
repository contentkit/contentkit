import * as redux from 'redux'
import { EditorState } from 'draft-js'
import { connectRouter } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import thunk from 'redux-thunk'

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
  selectedProject: undefined,
  selectedPosts: []
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
      console.log(action.payload.editorState.toJS())
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

export const selectProject = (projectId) => ({
  payload: {
    projectId
  },
  type: UPDATE_FEED_VARIABLES
})

export const selectPosts = (selectedPosts) => ({
  type: SELECT_POST,
  payload: {
    selectedPosts
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

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
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
