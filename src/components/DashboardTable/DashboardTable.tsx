import React from 'react'
import PropTypes from 'prop-types'

import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { Select, Theme, TableSortLabel, Toolbar, Paper, TableHead, TableBody, TableCell, TableRow, Table, IconButton, InputAdornment } from '@material-ui/core'
import { SortDirection } from '@material-ui/core/TableCell'
import { KeyboardArrowLeft, KeyboardArrowRight, Edit } from '@material-ui/icons'
import Chip from '../Chip'
import { withStyles, makeStyles } from '@material-ui/styles'
import clsx from 'clsx'
import Checkbox from '../Checkbox'
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group'
import orderBy from 'lodash/orderBy'
import Input from '../Input'
import { POSTS_AGGREGATE_QUERY } from '../../graphql/queries'

type Direction = 'asc' | 'desc'

const EditIcon = props => (
  <svg width="16" height="16" aria-hidden="true" focusable="false" data-prefix="fal" data-icon="pen" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M493.25 56.26l-37.51-37.51C443.25 6.25 426.87 0 410.49 0s-32.76 6.25-45.26 18.74L12.85 371.12.15 485.34C-1.45 499.72 9.88 512 23.95 512c.89 0 1.78-.05 2.69-.15l114.14-12.61 352.48-352.48c24.99-24.99 24.99-65.51-.01-90.5zM126.09 468.68l-93.03 10.31 10.36-93.17 263.89-263.89 82.77 82.77-263.99 263.98zm344.54-344.54l-57.93 57.93-82.77-82.77 57.93-57.93c6.04-6.04 14.08-9.37 22.63-9.37 8.55 0 16.58 3.33 22.63 9.37l37.51 37.51c12.47 12.48 12.47 32.78 0 45.26z"></path></svg>
)

const SaveIcon = props => (
  <svg width="16" height="16" aria-hidden="true" focusable="false" data-prefix="fal" data-icon="save" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM288 64v96H96V64h192zm128 368c0 8.822-7.178 16-16 16H48c-8.822 0-16-7.178-16-16V80c0-8.822 7.178-16 16-16h16v104c0 13.255 10.745 24 24 24h208c13.255 0 24-10.745 24-24V64.491a15.888 15.888 0 0 1 7.432 4.195l83.882 83.882A15.895 15.895 0 0 1 416 163.882V432zM224 232c-48.523 0-88 39.477-88 88s39.477 88 88 88 88-39.477 88-88-39.477-88-88-88zm0 144c-30.879 0-56-25.121-56-56s25.121-56 56-56 56 25.121 56 56-25.121 56-56 56z"></path></svg>
)

const ChevronDown = props => (
  <svg {...props} width="16" height="16" aria-hidden="true" focusable="false" data-prefix="fal" data-icon="chevron-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M443.5 162.6l-7.1-7.1c-4.7-4.7-12.3-4.7-17 0L224 351 28.5 155.5c-4.7-4.7-12.3-4.7-17 0l-7.1 7.1c-4.7 4.7-4.7 12.3 0 17l211 211.1c4.7 4.7 12.3 4.7 17 0l211-211.1c4.8-4.7 4.8-12.3.1-17z"></path></svg>
)

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
    $status: post_status!
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
  render: x => x,
  Component: TableCellInput
}, {
  title: 'Status',
  key: 'status',
  dataIndex: 'status',
  editable: true,
  render: x => x,
  Component: TableCellSelect,
  getOptions: () => ([
    { key: 'DRAFT', label: 'DRAFT' },
    { key: 'PUBLISHED', label: 'PUBLISHED' }
  ])
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

function TableCellInput (props) {
  const ref = React.useRef(null)
  const { onBlur, isEditing, value, onChange, onClick, isHovering, classes } = props

  React.useEffect(() => {
    if (isEditing) {
      ref.current.focus()
    }
  }, [isEditing])

  function toggleClick (evt) {
    onClick(evt)
  }

  return (
    <Input
      inputRef={ref}
      autoFocus={isEditing}      
      disabled={!isEditing}
      value={value}
      onChange={onChange}
      onClick={toggleClick}
      onBlur={onBlur}
      endAdornment={
        <InputAdornment position='end' className={classes.adornment}>
          <IconButton onClick={toggleClick}>
            {isEditing ? <SaveIcon /> : <EditIcon />}
          </IconButton>
        </InputAdornment>
      }
    />
  )
}

function TableCellSelect (props) {
  const { onBlur, isEditing, classes, value, onChange, onClick, getOptions } = props
  const options = getOptions(props)
  return (
    <Select
      native
      value={value}
      onChange={onChange}
      IconComponent={props => {
        return (<ChevronDown className={classes.icon} />)
      }}
      input={
        <Input
          onBlur={onBlur}
          endAdornment={
            <InputAdornment position='end' className={classes.adornment}>
              <IconButton onClick={onClick}>
                {isEditing ? <SaveIcon /> : <EditIcon />}
              </IconButton>
            </InputAdornment>
          }
        />
      }
      disabled={!isEditing}
    >
      {
        options.map(option => (<option key={option.key} value={option.key}>{option.label}</option>))
      }
    </Select>
  )
}

const useEditableCellStyles = makeStyles(theme => ({
  adornment: {
    // @ts-ignore
    visibility: props => props.isEditing ? 'visible' : 'hidden'
  },
  tableCell: {
    backgroundColor: '#f4f4f4',
    borderBottom: '1px solid #e0e0e0',
    '&:hover $button': {
      visibility: 'visible'
    }
  },
  icon: {
    color: 'rgba(0, 0, 0, 0.54)',
    position: 'absolute',
    pointerEvents: 'none',
    right: 50
  }
}))

function EditableCell (props) {
  const classes = useEditableCellStyles(props)
  const {
    row,
    column,
    onChange,
    toggleEditing,
    isEditing,
    onSave
  } = props
  const value = column.render(row[column.key])
  const { Component } = column
  const content = column.editable
    ? <Component
      raw={row[column.key]}
      value={value}
      onChange={({ target }) => onChange(row, column.key, target.value)}
      isEditing={isEditing}
      onClick={evt => toggleEditing(row, column)}
      getOptions={column.getOptions}
      classes={classes}
     // onBlur={evt => onSave(row)}
    />
    : value
  return (
    <TableCell
      key={column.key}
      className={classes.tableCell}
    >
      {content}
    </TableCell>
  )
}

function DashboardTableRow (props) {
  const {
    row,
    className,
    selectRow,
    selectedPosts,
    columns,
    classes,
    onChange,
    onSave
  } = props
  const [columnKey, setColumnKey] = React.useState(null)

  function toggleEditing (row, column) {
    if (columnKey === column.key) {
      setColumnKey(null)
      onSave(row)
    } else {
      setColumnKey(column.key)
    }
  }

  return (
    <CSSTransition
      key={row.id}
      timeout={1000}
      classNames='item'
    >
      <TableRow
        key={row.id}
        className={className}
      >
        <TableCell className={classes.checkboxTableCell}>
          <Checkbox
            value={row.id}
            checked={selectedPosts.includes(row.id)}
            id={`checkbox_${row.id}`}
            onChange={evt => selectRow(row.id)}
          />
        </TableCell>
        {columns.map(column => (
          <EditableCell
            toggleEditing={toggleEditing}
            isEditing={column.key === columnKey}
            column={column}
            row={row}
            onChange={onChange}
            onSave={onSave}
          />
        ))}
      </TableRow>
    </CSSTransition>
  )
}

const formatDate = (str) => distanceInWordsToNow(new Date(str))

type DashboardTableState = {
  offset: number,
  sortDirection: SortDirection,
  sortColumn: string
}

class DashboardTable extends React.Component<any, DashboardTableState> {
  static propTypes = {
    posts: PropTypes.object,
    projects: PropTypes.object,
    selectedPosts: PropTypes.array.isRequired,
    selectPosts: PropTypes.func.isRequired,
    renderToolbar: PropTypes.func.isRequired
  }

  state = {
    offset: 0,
    sortDirection: 'desc' as SortDirection,
    sortColumn: 'title'
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

    this.props.selectPosts(selection)
  }

  checkboxOnChange = (evt) => {
    evt.persist()
    const value = evt.target.value
    evt.preventDefault()
    evt.stopPropagation()
    // this.selectRow(value, evt.shiftKey)
  }

  load = (direction) => {
    const { variables, data: { posts_aggregate } } = this.props.posts
    const { nodes } = posts_aggregate
    const offset = direction === 'FORWARD' ? this.state.offset + 10 : Math.max(0, this.state.offset - 10)
    const nextVariables = {
      ...variables,
      limit: 10,
      offset: offset
    }

    return this.props.posts.fetchMore({
      variables: nextVariables,
      updateQuery: (previousResult, nextResult) => {
        if (!nextResult) return previousResult
        const { fetchMoreResult } = nextResult

        return {
          ...previousResult,
          posts_aggregate: {
            ...previousResult.posts_aggregate,
            nodes: [...previousResult.posts_aggregate.nodes, ...fetchMoreResult.posts_aggregate.nodes]
          }
        }
      }
    })
    .then(() => {
      this.setState({ offset })
    })
  }

  getNextPage = (direction) => {
    this.load(direction)
  }

  onChange = (post, propertyKey, propertyValue) => {
    const { variables, posts: { data: { posts_aggregate } } } = this.props
    const nodes = [...posts_aggregate.nodes]
    const index = nodes.findIndex(c => c.id === post.id)
    nodes[index] = {
      ...post,
      [propertyKey]: propertyValue
    }

    this.props.client.writeQuery({
      query: POSTS_AGGREGATE_QUERY,
      data: {
        posts_aggregate: {
          ...posts_aggregate,
          nodes: nodes
        }
      },
      variables: variables
    })
  }

  onSave = async (post) => {
    const { client, posts } = this.props
    await client.mutate({
      mutation: gql`
        mutation(
          $id: String!
          $title: String
          $status: post_status!
          $published_at: timestamp
          $project_id: String
        ) {
          update_posts (
            _set: {
              id: $id
              title: $title
              status: $status
              published_at: $published_at
              project_id: $project_id
            },
            where: { id: { _eq: $id } }
          ) {
            returning { 
              id
            }
          }
        }
      `,
      variables: {
        id: post.id,
        title: post.title,
        status: post.status,
        published_at: post.published_at,
        project_id: post.project.id 
      }
    })
  }

  render () {
    const {
      posts,
      search,
      selectedPosts,
      classes
    } = this.props
    const { offset, sortColumn, sortDirection } = this.state

    const dataSource = (posts?.data?.posts_aggregate?.nodes || [])
      .slice(offset, offset + 10)
      .map(row => ({ ...row, key: row.id }))
    return (
      <Mutation mutation={UPDATE_POST_TITLE}>
        {mutate => (
          <div className={classes.wrapper}>
            <div className={classes.toolbar}>
              {this.props.renderToolbar(this.props)}
            </div>
            <Paper elevation={0}>
              <TransitionGroup>
              <Table size='small' className={classes.table}>
                <TableHead>
                  <TableCell key='checkbox' className={classes.tableHeadCell} padding='checkbox' />
                  {columns.map(column =>
                    <TableCell
                      key={`tc_${column.key}`}
                      className={classes.tableHeadCell}
                      sortDirection={sortDirection as SortDirection}
                    >
                      <TableSortLabel
                        active={this.state.sortColumn === column.key}
                        direction={sortDirection as Direction}
                        onClick={evt => {
                          const { sortColumn, sortDirection } = this.state
                          this.setState({
                            sortColumn: column.key,
                            sortDirection: sortColumn === column.key && sortDirection === 'desc' ? 'asc' : 'desc'
                          })
                        }}
                      >
                        {column.title}
                      </TableSortLabel>
                    </TableCell>  
                  )}
                </TableHead>
                <TableBody>
                  {
                    orderBy(dataSource, [sortColumn], [sortDirection]).map(row => {
                      const className = clsx({
                        [classes.row]: true,
                        [classes.selected]: this.props.selectedPosts.includes(row.id)
                      })
                      return (
                        <DashboardTableRow
                          key={row.id}
                          row={row}
                          className={className}
                          selectRow={this.selectRow}
                          selectedPosts={selectedPosts}
                          columns={columns}
                          classes={classes}
                          onChange={this.onChange}
                          onSave={this.onSave}
                        />
                      )
                    })
                  }
                </TableBody>
              </Table>
              </TransitionGroup>
              <Toolbar disableGutters className={classes.pagination}>
                <IconButton onClick={evt => this.getNextPage('BACKWARD')}>
                  <KeyboardArrowLeft />
                </IconButton>
                <IconButton onClick={evt => this.getNextPage('FORWARD')}>
                  <KeyboardArrowRight />
                </IconButton>
              </Toolbar>
            </Paper>
          </div>
        )}
      </Mutation>
    )
  }
}

const styles = (theme: any) => ({
  checkboxTableCell: {
    backgroundColor: '#f4f4f4',
    borderBottom: '1px solid #e0e0e0'
  },
  tableHeadCell: {
    backgroundColor: '#e0e0e0'
  },
  wrapper: {
    margin: '1em 0',
    padding: 30,
    boxShadow: theme.variables.shadow1,
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
  },
  pagination: {
    justifyContent: 'flex-end'
  },
  selected: {},
  row: {}
})

export default withStyles(styles)(DashboardTable)
