import React from 'react'
import { Query } from 'react-apollo'

const withQuery = ({ options, name }: any) => Component =>
  class extends React.Component {
    render () {
      const queryProps = typeof options === 'function'
        ? options({ ownProps: this.props, name })
        : options
      return (
        <Query {...queryProps}>
          {state => {
            const componentProps = {
              ...this.props,
              [queryProps.name || 'data']: state
            }
            return (
              <Component {...componentProps} />
            )
          }}
        </Query>
      )
    }
  }

export default withQuery
