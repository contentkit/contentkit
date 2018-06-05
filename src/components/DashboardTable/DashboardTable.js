// @flow
import React from 'react'
import PropTypes from 'prop-types'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'
import DashboardTableRow from '../DashboardTableRow'
import EmptyTableRow from '../DashboardTableEmptyRow'
import LazyLoad from '../LazyLoad'
import EmptyTable from './EmptyTable'
import type { PostsQuery, ProjectsQuery } from '../../types'

const stylesheet = {
  wrapper: {
    margin: '1em 0'
  },
  grid: {}
}

const TableWrapper = props => (
  <Paper
    elevation={0}
    className={props.classes.wrapper}
  >
    {props.children}
  </Paper>
)

type Props = {
  posts: PostsQuery,
  projects: ProjectsQuery,
  classes: any,
  handlePostSelect: () => void,
  selectedPost: any
}

class DashboardTable extends React.Component<Props, {}> {
  static propTypes = {
    posts: PropTypes.object,
    projects: PropTypes.object,
    classes: PropTypes.object,
    selectedPost: PropTypes.object
  }

  render () {
    const {
      handlePostSelect,
      selectedPost,
      posts
    } = this.props
    const allPosts = (posts.data && posts.data.allPosts) || []
    const postsLoading = posts.loading || !allPosts.length
    if (!postsLoading && !allPosts.length) {
      return (
        <EmptyTable />
      )
    }
    return (
      <LazyLoad {...this.props} render={({ loading }) => (
        <TableWrapper classes={this.props.classes}>
          <Table>
            <TableBody>{
              allPosts.map((post, i) => (
                <DashboardTableRow
                  selected={(selectedPost && selectedPost.id) === post.id}
                  post={post}
                  key={`${post.id}-${i}`}
                  id={`${post.id}-${i}`}
                  loading={postsLoading} /* eslint-disable-line */
                  handlePostSelect={handlePostSelect}
                />
              ))}
              {loading && <EmptyTableRow edge />}
            </TableBody>
          </Table>
        </TableWrapper>
      )}
      />
    )
  }
}

export default withStyles(stylesheet)(DashboardTable)
