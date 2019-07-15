import { GRAPHQL_ENDPOINT } from './config'
import createClient from '@graphship/apollo-client'

export default () => createClient({
  uri: GRAPHQL_ENDPOINT,
  logout: () => {
    console.log('logout')
  }
})
