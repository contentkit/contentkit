import { HASURA_GRAPHQL_ENDPOINT, AUTH_GRAPHQL_ENDPOINT } from './config'
import { InMemoryCache, ApolloClient, ApolloLink, HttpLink } from '@apollo/client'
import gql from 'graphql-tag'
import format from 'date-fns/format'
import parse from 'date-fns/parse'

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

  const cache = new InMemoryCache({
    typePolicies: {
      // tags: {
      //   fields: {
      //     updated_at: {
      //       read: (existing, context) => {
      //         return format(new Date(existing), 'MM/DD/YYYY')
      //       }
      //     }
      //   }
      // }
      // posts_aggregate_fields: {
      //   fields: {
      //     count: {
      //       merge: (existing, incoming, { variables, storage, ...rest }) => {
      //         return (existing || 0) + incoming
      //       }
      //     }
      //   }
      // },
      // posts: {
      //   keyFields: ['id'],
      //   fields: {
      //     selected: {
      //       read: (existing, { variables }) => {
      //         return existing || false
      //       },
      //       merge: (existing, incoming, context) => {
      //         return incoming
      //       }
      //     }
      //   }
      // }
    }
  })

  return new ApolloClient({
    link: ApolloLink.from([
      middlewareLink,
      authLink,
      hasuraLink
    ]),
    // @ts-ignore
    cache: cache.restore(window.__APOLLO_STATE__),
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
