import { ApolloClient } from 'apollo-client'
import { split, ApolloLink } from 'apollo-link'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { GRAPH_COOL_ENDPOINT, GRAPH_COOL_SUBSCRIPTION_ENDPOINT } from './config'

const httpLink = createHttpLink({ uri: GRAPH_COOL_ENDPOINT })

const middlewareLink = new ApolloLink((operation, forward) => {
  const token = window.localStorage.getItem('token')
  const authorizationHeader = token ? `Bearer ${token}` : null
  operation.setContext({
    headers: {
      authorization: authorizationHeader
    }
  })
  return forward(operation)
})

const httpLinkWithAuthToken = middlewareLink.concat(httpLink)

const wsLink = new WebSocketLink({
  uri: GRAPH_COOL_SUBSCRIPTION_ENDPOINT,
  options: {
    reconnect: true
  }
})

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLinkWithAuthToken
)

export default () => (
  new ApolloClient({
    link,
    cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
    dataIdFromObject: object => object.id,
    shouldBatch: true
  })
)
