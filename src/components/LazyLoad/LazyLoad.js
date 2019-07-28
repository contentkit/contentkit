// @flow
import React from 'react'
import PropTypes from 'prop-types'
import Spinner from '../Spinner'
import debounce from 'lodash.debounce'
import { wrapWithLoadingState } from '../../lib/util'

class LazyLoad extends React.Component {
  static propTypes = {
    feed: PropTypes.object,
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
    const { feed } = this.props
    const { variables } = feed
    let { posts, count } = feed.data.feed

    if (posts.length + 10 >= count) {
      return
    }
    return feed.fetchMore({
      variables: {
        ...variables,
        offset: posts.length
      },
      updateQuery: (previousResult, nextResult) => {
        const { fetchMoreResult } = nextResult
        return {
          ...previousResult,
          feed: {
            ...previousResult.feed,
            posts: [...previousResult.feed.posts, ...fetchMoreResult.feed.posts]
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
