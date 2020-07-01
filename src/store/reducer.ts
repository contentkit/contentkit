import { EditorState } from 'draft-js'
import { 
  SET_EDITOR_STATE,
  SELECT_POST,
  SELECT_PROJECT,
  SET_SEARCH_QUERY,
  SET_SEARCH_LOADING_STATE,
  UPDATE_FEED_VARIABLES,
  SET_STATUS,
} from './fixtures'
import { LOCATION_CHANGE } from 'connected-react-router'

export const initialState = {
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
  selectedPostIds: [],
  status: {
    isSavingLocally: false,
    isSaving: false
  }
}


export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_EDITOR_STATE:
      return {
        ...state,
        editorState: action.payload.editorState
      }
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
    case SET_STATUS:
        return {
          ...state,
          status: {
            ...state.status,
            ...action.payload
          }
        }
    case LOCATION_CHANGE:
      return { ...state, editorState: EditorState.createEmpty() }
    default:
      return state
  }
}

export default reducer
