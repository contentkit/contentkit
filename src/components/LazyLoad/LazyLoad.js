// @flow
import React from 'react'
import PropTypes from 'prop-types'
import Spinner from '../Spinner'
import debounce from 'lodash.debounce'
import { wrapWithLoadingState } from '../../lib/util'

class LazyLoad extends React.Component {
  static propTypes = {
    posts: PropTypes.object.isRequired,
    projects: PropTypes.object,
    render: PropTypes.func
  }

  state = {
    loading: false
  }
  _hasUnmounted = false
  _isInFlight = false
  _positionY = 0
  _scrollY = 0

  componentDidMount () {
    window.addEventListener('scroll', this.onScroll)
  }

  componentWillUnmount () {
    this._hasUnmounted = true
    window.removeEventListener('scroll', this.onScroll)
  }

  load = () => {
    const { variables, data: { posts_aggregate } } = this.props.posts
    const { nodes } = posts_aggregate 
    // if (nodes.length + 10 >= posts_aggregate.aggregate.count) {
    //   return
    // }
    return this.props.posts.fetchMore({
      variables: {
        ...variables,
        offset: nodes.length
      },
      updateQuery: (previousResult, nextResult) => {
        const { fetchMoreResult } = nextResult
        return {
          ...previousResult,
          posts_aggregate: {
            ...previousResult.posts,
            nodes: [...previousResult.posts_aggregate.nodes, ...fetchMoreResult.posts_aggregate.nodes]
          }
        }
      }
    }).then(() => this.reset())
  }

  fetchMore = () => wrapWithLoadingState(
    (state) => window.requestIdleCallback(() => this.setState(state)),
    () => this.load(),
    () => this._hasUnmounted
  )

  reset = () => {
    let id = setTimeout(() => {
      this._isInFlight = false
      clearTimeout(id)
    }, 500)
  }

  onScroll = debounce(evt => {
    let bottom = window.scrollY + window.innerHeight >= document.body.clientHeight
    if (
      bottom &&
      !this._isInFlight
    ) {
      this._isInFlight = true
      this.fetchMore()
    }
  }, 100)

  render () {
    return (
      <div>
        {this.props.render(this.state)}
        {this.state.loading && <Spinner />}
      </div>
    )
  }
}

export default LazyLoad
