import { useMutation, useApolloClient } from '@apollo/client'
import {
  SIGNUP_USER,
  AUTHENTICATE_USER
} from '../../graphql/mutations'
import { GraphQLContexts } from '../../graphql/constants'

export function useAuthenticateUser () {
  const client = useApolloClient()
  const [mutate, data] = useMutation(AUTHENTICATE_USER, {
    context: GraphQLContexts.AUTH
  })

  return async (variables) => {
    let response
    try {
      response = await mutate({ variables: { credentials: variables } })
      console.log(response)
      const { data: { login: { token } } } = response
      if (response.errors && response.errors.length) {
        throw response.errors
      }
      if (token) {
        window.localStorage.setItem('token', token)
        await client.clearStore()
      }
    } catch (err) {
      throw { graphQLErrors: err?.graphQLErrors?.length ? err.graphQLErrors : [err] }
    }

    return response
  }
}

export function useRegisterUser () {
  const client = useApolloClient()
  const [mutate, data] = useMutation(SIGNUP_USER, {
    context: GraphQLContexts.AUTH
  })

  return async (variables) => {
    let response
    try {
      response = await mutate({ variables: { credentials: variables } })
      console.log(response)
      const { data: { register: { token } } } = response
      if (response.errors && response.errors.length) {
        throw response.errors
      }
      if (token) {
        window.localStorage.setItem('token', token)
        await client.clearStore()
      }
    } catch (err) {
      throw { graphQLErrors: err?.graphQLErrors?.length ? err.graphQLErrors : [err] }
    }

    return response
  }
}