// @flow
import React from 'react'
import PropTypes from 'prop-types'
import { USER_QUERY, GENERATE_TOKEN, UPDATE_USER } from './mutations'
import { Mutation } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import Profile from './Profile'

class ProfileWithData extends React.Component {
  generateToken = ({ auth, mutate }) =>
    variables => mutate({
      variables,
      optimisticResponse: {
        __typename: 'Mutation',
        generateToken: {
          __typename: 'User',
          ...auth.user,
          secret: 'xxx'
        }
      },
      update: (store, { data: { generateToken } }) => {
        const user = {
          ...auth.user,
          secret: generateToken.secret
        }

        store.writeQuery({
          query: USER_QUERY,
          data: { user }
        })
      }
    })

  render () {
    const { auth } = this.props
    return (
      <Mutation mutation={UPDATE_USER}>
        {(updateUser, updateUserData) => {
          return (
            <Mutation mutation={GENERATE_TOKEN}>
              {(generateToken, generateTokenData) => {
                return (
                  <Profile
                    {...this.props}
                    updateUser={{
                      mutate: variables => updateUser({ variables }),
                      ...updateUserData
                    }}
                    generateToken={{
                      mutate: generateToken,
                      ...generateTokenData
                    }}
                  />
                )
              }}
            </Mutation>
          )
        }}
      </Mutation>)
  }
}

export default withRouter(ProfileWithData)
