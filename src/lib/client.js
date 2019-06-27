import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'
import { GRAPHQL_ENDPOINT } from './config'
import { withClientState } from 'apollo-link-state'
import { ApolloLink } from 'apollo-link'
import createClient from '@graphship/apollo-client'

import introspectionQueryResultData from './fragmentTypes.json'

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData
})

const httpLink = createHttpLink({
  uri: GRAPHQL_ENDPOINT
})

const authLink = setContext((_, { headers }) => {
  const token = window.localStorage.getItem('token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
})

const cache = new InMemoryCache({ fragmentMatcher }) // .restore(window.__APOLLO_STATE__)

const stateLink = withClientState({
  cache,
  resolvers: {},
  defaults: {
    networkStatus: {
      __typename: 'NetworkStatus',
      isConnected: true
    }
  }
})

// export default () => new ApolloClient({
//   link: ApolloLink.from([stateLink, authLink, httpLink]),
//   cache: cache,
//   dataIdFromObject: object => object.id
// })

export default () => createClient({
  uri: GRAPHQL_ENDPOINT,
  logout: () => {
    console.log('logout')
  }
})
