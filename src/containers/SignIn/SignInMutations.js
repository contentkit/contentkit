import React from 'react'
import {
  SIGNUP_USER,
  AUTHENTICATE_USER
} from './mutations'
import { Mutation } from 'react-apollo'
import SignIn from './SignIn'
import { withRouter } from 'react-router-dom'

class SignInMutations extends React.Component {
  signin = ({ ownProps, mutate }) => async variables => {
    const client = this.props.client
    try {
      const resp = await mutate({ variables })
      const { data: { authenticateUser: { token } } } = resp
      if (resp?.errors?.length) { /* eslint-disable-line */
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

  create = ({ mutate, ownProps }) => async variables => {
    const client = this.props.client
    const resp = await mutate({ variables })
    if (resp?.errors?.length) { /* eslint-disable-line */
      throw resp.errors
    }
    const { data: { authenticateUser: { token } } } = resp
    if (token) {
      window.localStorage.setItem('token', token)
      await client.resetStore()
    }
    return resp
  }

  render () {
    return (
      <Mutation mutation={SIGNUP_USER}>
        {(signupUser, signupUserData) => {
          return (
            <Mutation mutation={AUTHENTICATE_USER}>
              {(authenticateUser, authenticateUserData) => {
                return (
                  <SignIn
                    {...this.props}
                    signin={{
                      mutate: this.signin({
                        mutate: authenticateUser,
                        ...this.props
                      }),
                      ...authenticateUserData
                    }}
                    create={{
                      mutate: this.create({
                        mutate: signupUser,
                        ...this.props
                      }),
                      ...signupUserData
                    }}
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

export default withRouter(SignInMutations)
