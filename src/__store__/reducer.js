import {
  UPDATE_VARIABLES,
  SELECT_POST,
  UPDATE_POST_TITLE,
  UPDATE_PROJECT,
  HYDRATE_EDITOR_STATE,
  UPDATE_EDITOR_STATE,
  UPDATE_STATUS,
  DISPATCH,
  SET_DIALOG_STATE
} from './types'

const appReducer = (state, action) => {
  switch (action.type) {
    case SELECT_POST:
      return state.set('selected', action.payload)
    case UPDATE_POST_TITLE:
      return state.set('title', action.payload)
    case UPDATE_VARIABLES:
      const variables = state.get('variables')
      return state.set('loading', true)
        .set('variables', variables.merge(action.payload))
    case UPDATE_PROJECT:
      return state
        .set('loading', true)
        .set('project', state.get('project').merge(action.payload))
    default:
      return state
  }
}

appReducer.key = 'app'

const editorReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE_EDITOR_STATE:
      return state.merge({
        hydrated: true,
        editorState: action.payload
      })
    case UPDATE_EDITOR_STATE:
      return state.set('editorState', action.payload)
    case UPDATE_STATUS:
      return state.set('status', action.payload)
    case DISPATCH:
      const nextState = typeof action.payload === 'function'
        ? action.payload(state)
        : action.payload
      return state.merge(nextState)
    case SET_DIALOG_STATE:
      return state.set('open', action.payload)
    default:
      return state
  }
}

editorReducer.key = 'editor'

const apply = (acc, reducer, action) => {
  const key = action.key || reducer.key
  const substate = acc.get(key)
  return acc.set(key, reducer(substate, action))
}

const combineReducers = (...reducers) =>
  (state, action) =>
    reducers.reduce((acc, reducer) =>
      apply(acc, reducer, action), state)

export const reducer = combineReducers(
  appReducer,
  editorReducer
)
