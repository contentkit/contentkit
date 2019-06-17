import React from 'react'
import PropTypes from 'prop-types'

import LazyLoad from '../LazyLoad'
import EmptyTable from './EmptyTable'
import Toolbar from '@material-ui/core/Toolbar'

import classes from './styles.scss'
import Table from 'antd/lib/table'

const TableWrapper = props => (
  <div
    elevation={0}
    className={classes.wrapper}
  >
    {props.children}
  </div>
)

class DashboardTable extends React.Component {
  static propTypes = {
    posts: PropTypes.object,
    projects: PropTypes.object,
    classes: PropTypes.object,
    selectedPost: PropTypes.object
  }

  onSelectChange = selectedRowKeys => {
    const { feed, handlePostSelect } = this.props
    const allPosts = feed?.data?.feed?.posts
    const [index] = selectedRowKeys
    handlePostSelect(allPosts.length >= index ? allPosts[index] : { id: null })
  }

  render () {
    const {
      feed
    } = this.props
    let allPosts = feed?.data?.feed?.posts
    if (!feed?.loading && !allPosts.length) {
      return (
        <EmptyTable />
      )
    }

    const columns = [{
      title: 'Title',
      key: 'title',
      dataIndex: 'title'
    }, {
      title: 'Status',
      key: 'status',
      dataIndex: 'status'
    }, {
      title: 'Project',
      key: 'project',
      dataIndex: 'project',
      render: (project) => project.name
    }, {
      title: 'Date',
      key: 'createdAt',
      dataIndex: 'createdAt'
    }]

    const dataSource = feed?.data?.feed?.posts || []

    return (
      <LazyLoad {...this.props} render={({ loading }) => (
        <TableWrapper classes={classes}>
          <Toolbar className={classes.toolbar}>
            {this.props.renderToolbar(this.props)}
          </Toolbar>
          <Table
            dataSource={dataSource}
            columns={columns}
            className={classes.table}
            rowSelection={{
              // selectedRowKeys: selectedPost ? [selectedPost.id] : [],
              onChange: this.onSelectChange
            }}
          />
        </TableWrapper>
      )} />
    )
  }
}

export default DashboardTable
