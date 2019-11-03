import React from 'react'
import {
  SIGNUP_USER,
  AUTHENTICATE_USER
} from '../../graphql/mutations'

import { Mutation } from 'react-apollo'
import Login from '@graphship/login'
import { withRouter } from 'react-router-dom'

class LoginWithData extends React.Component {
  signin = ({ ownProps, mutate }) => async ({ emailAddress: email, password }) => {
    const client = this.props.client
    try {
      const resp = await mutate({ variables: { email, password } })
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

  create = ({ mutate, ownProps }) => async ({ emailAddress: email, password }) => {
    const client = this.props.client
    const resp = await mutate({ variables: { email, password } })
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

  render () {
    const { users } = this.props
    return (
      <Mutation mutation={SIGNUP_USER}>
        {(signupUser, signupUserData) => {
          return (
            <Mutation mutation={AUTHENTICATE_USER}>
              {(authenticateUser, authenticateUserData) => {
                return (
                  <Login
                    {...this.props}
                    createAccount={this.create({
                      mutate: signupUser,
                      ...this.props
                    })}
                    login={this.signin({
                      mutate: authenticateUser,
                      ...this.props
                    })}
                    resetPassword={() => {}}
                    redirect={() => this.props.history.push('/')}
                    user={users?.data?.user}
                  />
                )
              }}
            </Mutation>
          )
        }}
      </Mutation>
    )
  }
}

export default withRouter(LoginWithData)
