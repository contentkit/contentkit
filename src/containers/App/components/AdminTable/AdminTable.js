// @flow
import React from 'react'
import PropTypes from 'prop-types'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'
import AdminTableRow from './AdminTableRow'
import Spinner from '../../../../components/Spinner'
import { unstable_deferredUpdates as deferredUpdates } from 'react-dom'
import EmptyTableRow from './EmptyTableRow'
import debounce from 'lodash.debounce'
import EmptyTable from './EmptyTable'

const stylesheet = {
  wrapper: {
    margin: '1em 0'
  },
  grid: {
    //gridColumnStart: 2,
    //gridRowStart: 2
  }
}

const PLACEHOLDER_DATA = Array(5).fill(0).map((_, i) => ({ id: `table-row-${i}` }))

const TableWrapper = props => (
  <Paper
    elevation={0}
    className={props.classes.wrapper}
  >
    {props.children}
  </Paper>
)

const wrapWithLoadingState = async (update, asyncFn, isUnmounted) => {
  if (isUnmounted()) {
    console.warn('Component is unmounted!')
    return
  }
  let shouldProceed = await new Promise((resolve, reject) => {
    update(prevState => {
      if (prevState.loading || isUnmounted()) {
        console.warn('Could not update loading state to true')
        resolve(false)
        return null
      }
      resolve(true)
      return { loading: true }
    })
  })
  if (!shouldProceed) return
  await asyncFn()
  deferredUpdates(
    () => update(prevState => {
      if (!prevState.loading || isUnmounted()) {
        console.warn('Could not update loading state to false')
        return null
      }
      return { loading: false }
    })
  )
}

class AdminTable extends React.Component {
  static propTypes = {
    posts: PropTypes.object,
    projects: PropTypes.object,
    app: PropTypes.object
  }

  state = {
    loading: false
  }
  _hasUnmounted = false
  _isInFlight = false
  positionY = 0
  scrollY = 0

  componentDidMount () {
    window.addEventListener('scroll', this.onScroll)
  }

  componentWillUnmount () {
    this._hasUnmounted = true
    window.removeEventListener('scroll', this.onScroll)
  }

  _fetchMore = async () => {
    const { posts } = this.props
    const { variables, data: { allPosts } } = posts
    let after = allPosts[allPosts.length - 1].id
    await posts.fetchMore({
      variables: {
        ...variables,
        first: 3,
        // skip: 1,
        after: after
      },
      updateQuery: (previousResult, nextResult) => {
        const { fetchMoreResult } = nextResult
        return {
          ...previousResult,
          allPosts: [...previousResult.allPosts, ...fetchMoreResult.allPosts]
        }
      }
    })
    this.reset()
  }

  fetchMore = () => wrapWithLoadingState(
    (state) => deferredUpdates(() => this.setState(state)),
    () => this._fetchMore(),
    () => this._hasUnmounted
  )

  reset = () => {
    this.timerId = setTimeout(() => {
      const allPosts = this.props.posts.data.allPosts
      const last = allPosts[allPosts.length - 1]
      let elem = document.getElementById(last.id)
      let rect = elem.getBoundingClientRect()
      this.positionY = rect.top + window.scrollY
      this._isInFlight = false
      clear()
    }, 200)
    const clear = () => {
      clearTimeout(this.timerId)
      this.timerId = undefined
    }
  }

  _onScroll = evt => {
    let y = window.innerHeight + window.scrollY
    if (y < this.scrollY) {
      return
    }
    if (
      (this.positionY === 0 || y > this.positionY) &&
      !this._isInFlight
    ) {
      this.scrollY = y
      this._isInFlight = true
      this.fetchMore()
    }
  }

  onScroll = debounce(this._onScroll, 100)

  render () {
    const {
      posts,
      handlePostSelect,
      selectedPost
    } = this.props
    const postsLoading = posts?.loading || !posts?.data?.allPosts
    if (!postsLoading && !posts?.data?.allPosts.length) {
      return (
         <EmptyTable />
      )
    }
    const allPosts = postsLoading
      ? PLACEHOLDER_DATA
      : [...posts.data.allPosts] /* eslint-disable-line */
    return (
      <React.Fragment>
        <div className={this.props.classes.grid} id='admin-table'>
          <TableWrapper classes={this.props.classes}>
            <Table>
              <TableBody>{
                allPosts.map((post, i) => (
                  <AdminTableRow
                    selected={(selectedPost && selectedPost.id) === post.id}
                    post={post}
                    key={post.id}
                    id={post.id}
                    loading={postsLoading} /* eslint-disable-line */
                    handlePostSelect={handlePostSelect}
                  />
                ))}
                {this.state.loading && <EmptyTableRow edge />}
              </TableBody>
            </Table>
          </TableWrapper>
        </div>
        {this.state.loading && <Spinner />}
      </React.Fragment>
    )
  }
}

export default withStyles(stylesheet)(AdminTable)
