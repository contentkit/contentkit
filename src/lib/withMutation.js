import React from 'react'
import { Mutation } from 'react-apollo'

const withMutation = ({ options, name, mutate }) => Component =>
  class extends React.Component {
    render () {
      return (
        <Mutation {...options}>
          {(rawMutate, state) => {
            const componentProps = { ...this.props }
            componentProps[name] = {
              state,
              mutate: (variables) => {
                const params = mutate({
                  variables: variables,
                  ownProps: this.props,
                  options: options,
                  name: name
                })

                return rawMutate(params)
              }
            }
            return (
              <Component {...componentProps} />
            )
          }}
        </Mutation>
      )
    }
  }

export default withMutation
