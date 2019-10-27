import { GRAPHQL_ENDPOINT } from './config'
import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { onError } from 'apollo-link-error'

const ANONYMOUS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMDAwMDAwMDAiLCJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6ImFub255bW91cyIsIngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsiYW5vbnltb3VzIl0sIngtaGFzdXJhLXVzZXItaWQiOiIwMDAwMDAwMDAifSwiaWF0IjoxNTcyMTYzMjA2LCJleHAiOjE2MDM3MjA4MDYsImF1ZCI6IjkyMTI4NjkyNmEzY2EyYmFiZjI2ZWI5MjdjNDZlOTkwNTVmYyJ9.63nMhfWT4THQ0mF-9n3XFTwsljUcwXXmHa_sIAUdW00'

export default ({ logout } = {}) => {
  const uri = GRAPHQL_ENDPOINT
  const middlewareLink = new ApolloLink((operation, forward) => {
    const token = window.localStorage.getItem('token') || ANONYMOUS_TOKEN
    operation.setContext({
      headers: {
        authorization: `Bearer ${token}`
      }
    })
    return forward(operation)
  })

  const errorLink = onError(({ networkError }) => {
    console.log(networkError)
    // if (networkError.statusCode === 401) {
    //   logout()
    // }
  })

  const httpLink = new HttpLink({ uri })

  return new ApolloClient({
    link: ApolloLink.from([
      middlewareLink,
      errorLink,
      httpLink
    ]),
    cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
    dataIdFromObject: object => object.id,
    shouldBatch: true,
    ssrMode: false, // default
    ssrForceFetchDelay: 0, // default
    queryDeduplication: true, // default
    assumeImmutableResults: false, // default
    connectToDevTools: true
    // name
    // version
  })
}
