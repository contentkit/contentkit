import React from 'react'
import { Mutation, compose } from 'react-apollo'

const withMutation = ({ options, name, mutate }) => Component =>
  class extends React.Component {

    mutate = commit => async variables => {
      const params = {
        variables: variables,
        ownProps: this.props,
        options: options,
        name: name
      }
    
      const composedMutate = compose(mutate, commit)

      let data
      try {
        data = await composedMutate(params)        
      } catch (err) {
        console.log(err)
      }

      return data
    }

    render () {
      return (
        <Mutation {...options}>
          {(commit, state) => {
            const componentProps = { ...this.props }
            componentProps[name] = {
              state,
              mutate: this.mutate(mutate).bind(this)
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
