import React from 'react'
import PropTypes from 'prop-types'

import LazyLoad from '../LazyLoad'

import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { Paper, TableHead, TableBody, TableCell, TableRow, Table } from '@material-ui/core'
import Chip from '../Chip'
import { withStyles } from '@material-ui/styles'
import clsx from 'clsx'
import Checkbox from '../Checkbox'

export const UPDATE_POST_TITLE = gql`
  mutation ($id: String!, $title: String!) {
    update_posts(where: { id: { _eq: $ID } }, _set: { title: $title }) {
      returning {
        id
        title
      }
    }
  }
`

export const UPDATE_POST = gql`
  mutation (
    $id: String!
    $title: String!
    $status: PostStatus
    $publishedAt: String
    $coverImageId: String
    $projectId: String
    $excerpt: String
  ) {
    insert_posts(object: {
      id: $id
      title: $title
      status: $status
      published_at: $publishedAt
      cover_image_id: $coverImageId
      project_id: $projetId
      excerpt: $excerpt
    }) {
      id
      created_at
      published_at
      title
      slug
      status
      excerpt
      project {
        id
        name
      }
      posts_tags {
        tag {
          id
          name
        }
      }
    }
  }
`

const columns = [{
  title: 'Title',
  key: 'title',
  dataIndex: 'title',
  editable: true,
  render: x => x
}, {
  title: 'Status',
  key: 'status',
  dataIndex: 'status',
  editable: false,
  render: x => x
}, {
  title: 'Project',
  key: 'project',
  dataIndex: 'project',
  render: (project) => project.name,
  editable: false
}, {
  title: 'Date',
  key: 'created_at',
  dataIndex: 'createdAt',
  editable: false,
  render: (date) => formatDate(date)
}, {
  title: 'Tags',
  key: 'posts_tags',
  dataIndex: 'tags',
  editable: false,
  render: (posts_tags) => {
    return posts_tags.map(({ tag }) => (
      <Chip key={tag.id} label={tag.name} style={{ marginRight: 8 }} />
    ))
  }
}]

const formatDate = (str) => distanceInWordsToNow(new Date(str))

class DashboardTable extends React.Component {
  static propTypes = {
    posts: PropTypes.object,
    projects: PropTypes.object,
    selectedPosts: PropTypes.array.isRequired,
    selectPosts: PropTypes.func.isRequired,
    renderToolbar: PropTypes.func.isRequired
  }

  handleSave = mutate => (post) => {
    mutate({
      variables: {
        id: post.id,
        title: post.title
      },
      optimisticResponse: {
        __typename: 'Mutation',
        updatePostTitle: {
          __typename: 'Post',
          ...post
        }
      }
    })
  }

  selectRow = (value, shiftKey = true) => {
    const { selectedPosts } = this.props
    const isSelected = selectedPosts.includes(value)
    const selection = isSelected
      ? selectedPosts.filter(key => key !== value)
      : shiftKey
        ? selectedPosts.concat([value])
        : [value]
    console.log({
      selection,
      selectedPosts
    })
    this.props.selectPosts(selection)
  }

  checkboxOnChange = (evt) => {
    evt.persist()
    const value = evt.target.value
    console.log(value)
    evt.preventDefault()
    evt.stopPropagation()
    // this.selectRow(value, evt.shiftKey)
  }

  render () {
    const {
      posts,
      search,
      selectedPosts,
      classes
    } = this.props

    const dataSource = (posts?.data?.posts_aggregate?.nodes || []).map(row => ({ ...row, key: row.id }))
    return (
      <Mutation mutation={UPDATE_POST_TITLE}>
        {mutate => (
          <LazyLoad {...this.props} render={({ loading }) => (
            <div className={classes.wrapper}>
              <div className={classes.toolbar}>
                {this.props.renderToolbar(this.props)}
              </div>
              <Paper elevation={0}>
                <Table size='small' className={classes.table}>
                  <TableHead>
                    <TableCell key='checkbox' className={classes.tableCell} padding='checkbox' />
                    {columns.map(column =>
                      <TableCell key={`td_${column.key}`} className={classes.tableCell}>{column.title}</TableCell>  
                    )}
                  </TableHead>
                  <TableBody>
                    {
                      dataSource.map(row => {
                        const className = clsx({
                          [classes.row]: true,
                          [classes.selected]: this.props.selectedPosts.includes(row.id)
                        })
                        return (
                          <TableRow key={row.id} className={className} onMouseDown={evt => this.selectRow(row.id)}>
                            <TableCell className={classes.tableCell}>
                              <Checkbox
                                value={row.id}
                                checked={selectedPosts.includes(row.id)}
                                // onChange={this.checkboxOnChange}
                                id={`checkbox_${row.id}`}
                              />
                            </TableCell>
                            {columns.map(column =>
                              <TableCell key={column.key} className={classes.tableCell}>
                                {column.render(row[column.key])}
                              </TableCell>
                            )}
                          </TableRow>
                        )
                      })
                    }
                  </TableBody>
                </Table>
              </Paper>
            </div>
          )} />
        )}
      </Mutation>
    )
  }
}

const styles = theme => ({
  tableCell: {
    backgroundColor: '#f4f4f4',
    borderBottom: '1px solid #e0e0e0',
    // borderBottom: `1px solid ${theme.variables.borderColor}`,
  },
  wrapper: {
    margin: '1em 0',
    padding: 30,
    boxShadow: theme.variables.shadow1,
    // borderRadius: 5,
    backgroundColor: theme.variables.cardBackground
  },
  table: {
    border: `1px solid ${theme.variables.borderColor}`,
    fontFamily: theme.variables.fontFamily
  },
  toolbar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  }
})

export default withStyles(styles)(DashboardTable)
