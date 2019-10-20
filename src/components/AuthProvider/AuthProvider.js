import React from 'react'
import { Query } from 'react-apollo'
import { USER_QUERY } from '../../graphql/queries'
import { Redirect } from 'react-router-dom'

function AuthProvider (props) {
  return (
    <Query query={USER_QUERY}>
      {user => {
        if (!user.loading) {
          if (!user.data.user) {
            if (window.location.pathname !== '/login') {
              return <Redirect to='/login' />
            }
          }
        }
        return React.Children.map(props.children, child => {
          console.log({ user })
          return React.cloneElement(child, { user, logged: true })
        })
      }}
    </Query>
  )
}

export default AuthProvider
