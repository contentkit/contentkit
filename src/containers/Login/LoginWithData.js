import React from 'react'
import {
  SIGNUP_USER,
  AUTHENTICATE_USER
} from '../../graphql/mutations'

import { useMutation, useApolloClient } from '@apollo/react-hooks'
import Login from './StyledLogin'
import { withRouter } from 'react-router-dom'

function LoginWithData (props) {
  const client = useApolloClient()
  const { users } = props
  const [authenticateUserMutation, authenticateUserData] = useMutation(AUTHENTICATE_USER)
  const [signupUserMutation, signupUserData] = useMutation(SIGNUP_USER)

  const authenticateUser = async ({ emailAddress: email, password }) => {
    try {
      const resp = await authenticateUserMutation({ variables: { email, password } })
      const { data: { login: { token } } } = resp
      if (resp.errors && resp.errors.length) {
        throw resp.errors
      }
      if (token) {
        window.localStorage.setItem('token', token)
        await client.resetStore()
      }
      return resp
    } catch (err) {
      throw err
    }
  }

  const signupUser = async ({ emailAddress: email, password }) => {
    const resp = await signupUserMutation({ variables: { email, password } })
    if (resp.errors && resp.errors.length) {
      throw resp.errors
    }
    const { data: { register: { token } } } = resp
    if (token) {
      window.localStorage.setItem('token', token)
      await client.resetStore()
    }
    return resp
  }

  const componentProps = {
    ...props,
    createAccount: signupUser,
    login: authenticateUser,
    // resetPassword: () => {},
    // redirect: () => {},
    user: users?.data?.users[0]
  }

  return (
    <Login {...componentProps} />
  )
}

export default withRouter(LoginWithData)
