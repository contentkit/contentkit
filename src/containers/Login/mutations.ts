import { useMutation, useApolloClient } from '@apollo/react-hooks'
import {
  SIGNUP_USER,
  AUTHENTICATE_USER
} from '../../graphql/mutations'

export function useAuthenticateUser () {
  const client = useApolloClient()
  const [mutate, data] = useMutation(AUTHENTICATE_USER)

  return async (variables) => {
    let response
    try {
      response = await mutate({ variables })
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
      throw err
    }

    return response
  }
}

export function useRegisterUser () {
  const client = useApolloClient()
  const [mutate, data] = useMutation(SIGNUP_USER)

  return async (variables) => {
    let response
    try {
      response = await mutate({ variables })
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
      throw err
    }

    return response
  }
}