// @flow
import React from 'react'
import PropTypes from 'prop-types'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'
import DashboardTableRow from '../DashboardTableRow'
import EmptyTableRow from '../DashboardTableEmptyRow'
import LazyLoad from '../LazyLoad'
import EmptyTable from './EmptyTable'
import Toolbar from '@material-ui/core/Toolbar'
import DashboardToolbar from '../DashboardToolbar'

const stylesheet = {
  wrapper: {
    margin: '1em 0',
    borderRadius: '5px',
    boxShadow: 'rgba(8, 35, 51, 0.03) 0px 0px 2px, rgba(8, 35, 51, 0.05) 0px 3px 6px',
    padding: '30px'
  },
  grid: {},
  toolbar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: -24,
    marginRight: -24
  }
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

  renderRows = () => {
    let { feed, selectedPost, handlePostSelect } = this.props
    let allPosts = feed?.data?.feed?.posts || []
    if (!allPosts.length) {
      return (
        <React.Fragment>
          <EmptyTableRow />
          <EmptyTableRow />
          <EmptyTableRow />
          <EmptyTableRow />
          <EmptyTableRow />
        </React.Fragment>
      )
    }
    return allPosts.map(post => (
      <DashboardTableRow
        selected={selectedPost?.id === post.id}
        post={post}
        key={post.id}
        loading={feed?.loading}
        handlePostSelect={handlePostSelect}
      />
    ))
  }

  render () {
    const {
      feed,
      classes
    } = this.props
    let allPosts = feed?.data?.feed?.posts
    if (!feed?.loading && !allPosts.length) {
      return (
        <EmptyTable />
      )
    }
    return (
      <LazyLoad {...this.props} render={({ loading }) => (
        <TableWrapper classes={classes}>
          <Toolbar className={classes.toolbar}>
            {this.props.renderToolbar(this.props)}
          </Toolbar>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Title</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Project</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.renderRows()}
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
