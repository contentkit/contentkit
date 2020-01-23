import * as redux from 'redux'
import thunk from 'redux-thunk'
import { connectRouter } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import reducer, { initialState } from './reducer'
import editorMiddleware from './middleware'
const history = createBrowserHistory()

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
  : redux.compose

const middleware = [thunk, editorMiddleware]

const combinedReducer = redux.combineReducers({
  app: reducer,
  router: connectRouter(history)
})

const enhancer = composeEnhancers(
  redux.applyMiddleware(...middleware)
)

export const store = redux.createStore(combinedReducer, { app: initialState }, enhancer)

export default store

