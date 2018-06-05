// @flow
import React from 'react'
import PropTypes from 'prop-types'
import Spinner from '../Spinner'
import { unstable_deferredUpdates as deferredUpdates } from 'react-dom'
import debounce from 'lodash.debounce'
import { wrapWithLoadingState } from '../../lib/util'
import type { Posts, Projects } from '../../types'

type Props = {
  posts: Posts,
  projects: Projects,
  render: ({ loading: boolean }) => React$Node
}

class LazyLoad extends React.Component<Props, { loading: boolean }> {
  timerId: TimeoutID

  static propTypes = {
    posts: PropTypes.object,
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
    const { posts } = this.props
    const { variables, data: { allPosts } } = posts
    let after = allPosts[allPosts.length - 1].id
    return posts.fetchMore({
      variables: {
        ...variables,
        first: 3,
        after: after
      },
      updateQuery: (previousResult, nextResult) => {
        const { fetchMoreResult } = nextResult
        return {
          ...previousResult,
          allPosts: [...previousResult.allPosts, ...fetchMoreResult.allPosts]
        }
      }
    }).then(() => this.reset())
  }

  fetchMore = () => wrapWithLoadingState(
    (state) => deferredUpdates(() => this.setState(state)),
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
      <div id='lazy-load'>
        {this.props.render(this.state)}
        {this.state.loading && <Spinner />}
      </div>
    )
  }
}

export default LazyLoad
