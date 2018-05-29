
import React from 'react'
import { Record, List, Map } from 'immutable'
import { createStore } from '../lib/createStore'
import { reducer } from './reducer'
import { createEmpty } from 'monograph'

export const AppState = Record({
  selected: List(),
  title: '',
  loading: false,
  variables: Map({
    query: undefined,
    first: 5,
    last: undefined,
    after: undefined,
    before: undefined
  }),
  project: Map({
    anchorEl: undefined,
    title: '',
    selected: 0
  })
})

export const PostEditorState = Record({
  status: 'online',
  open: undefined,
  editorState: createEmpty(),
  html: '',
  hydrated: false
})

export const appState = new AppState()
export const postEditorState = new PostEditorState()
const initialState = Map({
  app: appState,
  editor: postEditorState
})
const store = createStore(reducer, initialState)
export const StoreProvider = store.StoreProvider
export const StoreConsumer = store.StoreConsumer
export const withStore = store.withStore
export const actionDispatcher = store.actionDispatcher
