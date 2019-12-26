// @flow
import React from 'react'
import PropTypes from 'prop-types'

import { USER_QUERY } from '../../graphql/queries'
import { GENERATE_TOKEN, UPDATE_USER, DELETE_USER } from '../../graphql/mutations'

import { useMutation } from '@apollo/react-hooks'
import { withRouter } from 'react-router-dom'
import Profile from './Profile'

function ProfileWithData (props) {
  const [generateTokenMutation, generateTokenData] = useMutation(GENERATE_TOKEN)
  const [updateUserMutation, updateUserData] = useMutation(UPDATE_USER)
  const [deleteUserMUtation, deleteUserData] = useMutation(DELETE_USER)

  const { client, history } = props

  const generateToken = variables => mutate({
    variables,
    optimisticResponse: {
      __typename: 'Mutation',
      generateToken: {
        __typename: 'User',
        ...this.props.users.data.users[0],
        secret: 'pending...'
      }
    },
    update: (store, { data: { generateToken } }) => {
      const user = {
        ...this.props.users.data.users[0],
        secret: generateToken.secret
      }

      store.writeQuery({
        query: USER_QUERY,
        data: { user }
      })
    }
  })

  const profileProps = {
    updateUser: {
      mutate: variables => updateUser({ variables }),
      ...updateUserData
    },
    generateToken: {
      mutate: generateToken,
      ...generateTokenData
    },
    deleteUser: {
      mutate: variables => {
        return deleteUser().then(() => {
          window.localStorage.removeItem('token')
          client.resetStore()
          history.replace('/login')
        })
      }
    }
  }

  return (
    <ProfileWithData {...props} {...profileProps} />
  )
}

export default withRouter(ProfileWithData)
