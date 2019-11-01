import React from 'react'
import { Mutation, compose } from 'react-apollo'

const withMutation = ({ options, name, mutate }: any) => (Component: any) =>
  class extends React.Component {

    mutate = commit => async variables => {  
      const params = mutate({
        variables: variables,
        ownProps: this.props,
        options: options,
        name: name
      })

      let data
      try {
        data = await commit(params)        
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
              mutate: this.mutate(commit).bind(this)
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
