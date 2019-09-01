import React from 'react'
import { Query } from 'react-apollo'

const withQuery = ({ options, name }) => Component =>
  class extends React.Component {
    render () {
      const queryProps = typeof options === 'function'
        ? options({ ownProps: this.props, name })
        : options
      return (
        <Query {...queryProps}>
          {state => {
            const componentProps = {
              [options.name || 'data']: state,
              ...this.props
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
