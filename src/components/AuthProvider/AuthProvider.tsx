import React from 'react'
import { Query } from 'react-apollo'
// @ts-ignore
import { USER_QUERY } from '../../graphql/queries'
import { Redirect, withRouter } from 'react-router-dom'

function AuthProvider (props: any) {
  return (
    <Query query={USER_QUERY}>
      {(users: any) => {
        if (!users.loading) {
          if (!users?.data?.users) {
            if (!props.history.location.pathname.startsWith('/login')) {
              return <Redirect to='/login' />
            }
          }
        }
        return React.Children.map(props.children, child => {
          return React.cloneElement(child, { users, logged: true })
        })
      }}
    </Query>
  )
}

export default withRouter(AuthProvider)
