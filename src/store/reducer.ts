import { 
  SELECT_POST,
  SELECT_PROJECT,
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
  selectedProjectId: null,
  selectedPostIds: [],
  status: {
    isSavingLocally: false,
    isSaving: false
  }
}


export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SELECT_POST:
      return { ...state, ...action.payload }
    case SELECT_PROJECT:
      return { ...state, ...action.payload }
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
    default:
      return state
  }
}

export default reducer
