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

  const keyArgs = (_args, context) => {
    console.log({ _args, context })
    return context.fieldName
  }

  return new ApolloClient({
    link: ApolloLink.from([
      middlewareLink,
      // errorLink,
      authLink,
      hasuraLink
    ]),
    // @ts-ignore
    cache: new InMemoryCache({
      typePolicies: {
        posts_aggregate_fields: {
          fields: {
            count: {
              merge: (existing, incoming, { variables, storage, ...rest }) => {
                return (existing || 0) + incoming
              }
            }
          }
        },
        posts: {
          keyFields: ['id']
        },
        // posts_aggregate: {
        //   fields: {
        //     nodes: {
              // keyArgs: ['where'],
              // merge: (existing, incoming, context) => {
              //   return (existing || []).concat(incoming)
              // },
              // read(existing: any[], { variables, ...rest }) {
              //   console.log({
              //     existing, rest, variables
              //   })
              //   // If we read the field before any data has been written to the
              //   // cache, this function will return undefined, which correctly
              //   // indicates that the field is missing.
              //   const page = existing && existing.slice(
              //     variables.offset,
              //     variables.offset + variables.limit,
              //   );
              //   // If we ask for a page outside the bounds of the existing array,
              //   // page.length will be 0, and we should return undefined instead of
              //   // the empty array.
              //   if (page && page.length > 0) {
              //     return page;
              //   }
              //   // return existing
              // }
          //   }
          // }
        // }
      }
    }).restore(window.__APOLLO_STATE__),
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
