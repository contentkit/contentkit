// @flow
import React from 'react'
import {
  SIGNUP_USER,
  AUTHENTICATE_USER
} from '../../graphql/mutations'

import { Mutation } from 'react-apollo'
import Login from '@menubar/login'
import '@menubar/login/dist/style.css'
import { withRouter } from 'react-router-dom'

class LoginWithData extends React.Component {
  signin = ({ ownProps, mutate }) => async ({ emailAddress, password }) => {
    const client = this.props.client
    try {
      const resp = await mutate({ variables: { emailAddress, password } })
      const { data: { signinUser: { token } } } = resp
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

  create = ({ mutate, ownProps }) => async ({ emailAddress, password }) => {
    const client = this.props.client
    const resp = await mutate({ variables: { emailAddress, password } })
    if (resp.errors && resp.errors.length) {
      throw resp.errors
    }
    const { data: { signinUser: { token } } } = resp
    if (token) {
      window.localStorage.setItem('token', token)
      await client.resetStore()
    }
    return resp
  }

  render () {
    const { user } = this.props
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
                    user={user?.data?.user}
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
