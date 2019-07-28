import React from 'react'
import { Query } from 'react-apollo'
import { USER_QUERY } from '../../graphql/queries'

class AuthProvider extends React.Component {
  render () {
    return (
      <Query query={USER_QUERY}>
        {user => (
          React.cloneElement(this.props.children, {
            user
          })
        )}
      </Query>
    )
  }
}

export default AuthProvider
