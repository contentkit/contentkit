import * as ActionTypes from './fixtures'
import { saveEditorStateLocally } from './actions'
import { LOCATION_CHANGE } from 'connected-react-router'

let timeout

const editorMiddleware = store => next => action => {
  if (action.type === ActionTypes.SET_EDITOR_STATE) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      store.dispatch(saveEditorStateLocally())
    }, 3000)
  }

  if (action.type === LOCATION_CHANGE) {
    clearTimeout(timeout)
  }

  return next(action)
}

export default editorMiddleware
