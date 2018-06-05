import React from 'react'
import { unstable_deferredUpdates as deferredUpdates } from 'react-dom'

export const createMutation = ({ props, mutation }) => ownProps => {
  const { client } = ownProps
  const refetchQueries = ownProps.refetchQueries
  const mutate = (options = {}) => client.mutate({
    mutation,
    context: {},
    refetchQueries,
    ...options
  })

  return props({ ownProps, mutate })
}

export const withMutations = (...mutations) => Component => {
  const cache = mutations.reduce((acc, val) =>
    acc.set(val.name, createMutation(val)), new Map()
  )
  const initialState = mutations.reduce((acc, val) => {
    acc[val.name] = {
      loading: false,
      result: null,
      error: null
    }
    return acc
  }, {})

  class MutationState extends React.Component {
    state = initialState

    _isUnmounted = false
    componentDidMount () {
      this._isUnmounted = false
    }

    componentWillUnmount () {
      this._isUnmounted = true
    }

    update = data => {
      deferredUpdates(() => this.setState(() => {
        if (this._isUnmounted) {
          return null
        }
        return data
      }))
    }

    mutate = name => {
      let key = name
      return async (...args) => {
        this.update({
          [key]: {
            loading: true,
            result: null,
            error: null
          }
        })
        const result = await cache.get(name)(this.props)(...args)
        this.update({
          [key]: {
            loading: false,
            result: result,
            error: null
          }
        })
        return result
      }
    }

    render () {
      return (
        <Component
          {...this.props}
          {...this.state}
          mutate={this.mutate}
        />
      )
    }
  }
  return MutationState
}
