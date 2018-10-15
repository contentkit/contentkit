import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { GRAPHQL_ENDPOINT } from './config'

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

export default () => new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
  dataIdFromObject: object => object.id,
  shouldBatch: true
})