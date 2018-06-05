import gql from 'graphql-tag'
import fragments from '../lib/fragments'
import React from 'react'
import { Query, withApollo } from 'react-apollo'
import AppRouter from './Router'
import { Redirect, withRouter } from 'react-router-dom'

const USER_QUERY = gql`
  query {
    user {
      ...UserFields
      projects {
        ...ProjectFields
      }
    }
  }
  ${fragments.user}
  ${fragments.project}
`

class AuthQuery extends React.Component {
  render () {
    return (
      <Query query={USER_QUERY}>
        {({ loading, data }) => {
          if (loading) return (<div />)

          return <AppRouter {...this.props} auth={data} />
        }}
      </Query>
    )
  }
}

export default withApollo(AuthQuery)
