import React from 'react'
import { Query } from 'react-apollo'
import { USER_QUERY } from '../../graphql/queries'

function AuthProvider (props) {
  return (
    <Query query={USER_QUERY}>
      {user => (
        React.cloneElement(props.children, {
          user
        })
      )}
    </Query>
  )
}

export default AuthProvider
