import { HASURA_GRAPHQL_ENDPOINT, AUTH_GRAPHQL_ENDPOINT } from './config'
import { InMemoryCache, ApolloClient, ApolloLink, HttpLink } from '@apollo/client'

const ANONYMOUS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMDAwMDAwMDAiLCJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6ImFub255bW91cyIsIngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsiYW5vbnltb3VzIl0sIngtaGFzdXJhLXVzZXItaWQiOiIwMDAwMDAwMDAifSwiaWF0IjoxNTcyMTYzMjA2LCJleHAiOjE3MzU2ODk2MDAsImF1ZCI6IjkyMTI4NjkyNmEzY2EyYmFiZjI2ZWI5MjdjNDZlOTkwNTVmYyJ9.cd-OTV_RNop4eDN8SK3p3XFA3ImzZMomsHOxUOKPKus'

const createClient = () => {
  const middlewareLink = new ApolloLink((operation, forward) => {
    const token = window.localStorage.getItem('token') || ANONYMOUS_TOKEN
    operation.setContext({
      headers: {
        authorization: `Bearer ${token}`
      }
    })
    return forward(operation)
  })

  const hasuraLink = ApolloLink.split(
    (operation) => !operation.getContext().target || operation.getContext().target === 'hasura',
    new HttpLink({
      uri: HASURA_GRAPHQL_ENDPOINT
    })
  )

  const authLink = ApolloLink.split(
    (operation) => operation.getContext().target === 'auth',
    new HttpLink({
      uri: AUTH_GRAPHQL_ENDPOINT
    })
  )

  return new ApolloClient({
    link: ApolloLink.from([
      middlewareLink,
      // errorLink,
      authLink,
      hasuraLink
    ]),
    // @ts-ignore
    cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
    // @ts-ignore
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


export default createClient()
