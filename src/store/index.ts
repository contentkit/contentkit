import * as redux from 'redux'
import thunk from 'redux-thunk'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import reducer, { initialState } from './reducer'

const UP_STAGE = process.env.UP_STAGE || undefined

export const history = createBrowserHistory({
  basename: UP_STAGE
})

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
  : redux.compose

const middleware = [routerMiddleware(history), thunk]

const combinedReducer = redux.combineReducers({
  app: reducer,
  router: connectRouter(history)
})

const enhancer = composeEnhancers(
  redux.applyMiddleware(...middleware)
)

export const store = redux.createStore(combinedReducer, { app: initialState }, enhancer)

export default store

