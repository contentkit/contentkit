// window.__DRAFT_GKX = window.__DRAFT_GKX || {}
// window.__DRAFT_GKX.draft_tree_data_support = true

import React from 'react'
import { render } from 'react-dom'
import { ApolloProvider } from 'react-apollo'
import createClient from './lib/client'
import Router from './Router'

const client = createClient()

render(
  <ApolloProvider client={client}>
    <Router />
  </ApolloProvider>,
  document.getElementById('root')
)
