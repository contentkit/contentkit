import React from 'react'

import { useApolloClient } from '@apollo/client'
import { Grow, Paper, TableBody, TableRow, TableCell, Table, CircularProgress } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import { SortDirection } from '@material-ui/core/TableCell'
import orderBy from 'lodash/orderBy'
import { POSTS_AGGREGATE_QUERY } from '../../graphql/queries'
import { useOnSave } from './mutations'
import columns from './columns'
import DashboardTableRow from './components/TableRow'
import DashboardPagination from './components/DashboardPagination'
import DashboardTableHead from './components/TableHead'
import { GraphQL } from '../../types'
import useStyles from './styles'

enum PaginationDirection {
  FORWARD = 'forward',
  BACKWARD = 'backward'
}

type Direction = 'asc' | 'desc'

type SortState = {
  direction: SortDirection,
  column: string
}

const initialSortState : SortState = {
  direction: 'desc',
  column: 'title'
}

function DashboardTable (props) {
  const {
    posts,
    selectedPostIds,
    setSelectedPostIds,
    searchLoading,
    setSearchLoading,
    getToolbarProps,
    renderToolbar,
    settings,
    offset,
    setOffset,
    placeholders
  } = props

  const classes = useStyles(props)
  const client = useApolloClient()
  const onSave = useOnSave()
  const [sort, setSort] = React.useState(initialSortState)

  const [anchorEl, setAnchorEl] = React.useState(null)

  const setContextMenuAnchorEl = (evt: any) => {
    setAnchorEl(evt.target)
  }

  const contextMenuOnClose = () => {
    setAnchorEl(null)
  }

  const selectRow = (value, shiftKey = true) => {
    const isSelected = selectedPostIds.includes(value)
    const selection = isSelected
      ? selectedPostIds.filter(key => key !== value)
      : shiftKey
        ? selectedPostIds.concat([value])
        : [value]

    setSelectedPostIds(selection)
  }

  const onContextMenu = (evt, row) => {
    evt.preventDefault()
    setSelectedPostIds([row.id])
    setContextMenuAnchorEl(evt)
  }

  const load = (direction: PaginationDirection) => {
    const { variables, data: { posts_aggregate } } = posts
    const { nodes } = posts_aggregate
    const nextOffset = direction === PaginationDirection.FORWARD ? offset + 10 : Math.max(0, offset - 10)
    const nextVariables = {
      ...variables,
      limit: 10,
      offset: nextOffset
    }

    return posts.fetchMore({
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
      setSelectedPostIds([])
      setOffset(nextOffset)
      setSearchLoading(false)
    })
  }

  const getNextPage = (direction: PaginationDirection) => {
    setSearchLoading(true)
    load(direction)
  }

  const onChange = (post: GraphQL.Post, propertyKey: string, propertyValue: any) => {
    const { variables, posts: { data: { posts_aggregate } } } = props
    const nodes = [...posts_aggregate.nodes]
    const index = nodes.findIndex(c => c.id === post.id)
    nodes[index] = {
      ...post,
      [propertyKey]: propertyValue
    }

    client.writeQuery({
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

  const onSort = column => () => {
    setSort({
      column: column.key,
      direction: sort.column === column.key && sort.direction === 'desc' ? 'asc' : 'desc' 
    })
  }

  const rows = React.useMemo(() => {
    const dataSource = (posts?.data?.posts_aggregate?.nodes || [])
      .slice(offset, offset + 10)
      .map(row => ({ ...row, key: row.id }))

    return orderBy(dataSource, [sort.column], [sort.direction])
  }, [offset, posts, sort])
 
  const toolbarProps = getToolbarProps()
  return (
    <div className={classes.wrapper}>
      <Paper elevation={0} className={classes.paper}>
        {renderToolbar(toolbarProps)}
        {/* <Grow in={searchLoading} unmountOnExit mountOnEnter>
          <div className={classes.progress}>
            <CircularProgress />
          </div>
        </Grow> */}
        <Table size='small' className={classes.table}>
          <DashboardTableHead sort={sort} onSort={onSort} columns={columns} />
            <TableBody>
            {
            searchLoading
            ? placeholders.map(placeholder => (
                <TableRow>
                  <TableCell>
                    <CheckBoxOutlineBlankIcon className={classes.checkbox} />
                  </TableCell>
                  <TableCell>
                    {placeholder}
                  </TableCell>
                  <TableCell>
                    {placeholder}
                  </TableCell>
                  <TableCell>
                    {placeholder}
                  </TableCell>
                  <TableCell>
                    {placeholder}
                  </TableCell>
                  <TableCell>
                    {placeholder}
                  </TableCell>
                  <TableCell>
                    {placeholder}
                  </TableCell>
                </TableRow>
              ))
            : rows.map(row => {
                return (
                  <DashboardTableRow
                    key={row.id}
                    row={row}
                    selectRow={selectRow}
                    selectedPostIds={selectedPostIds}
                    columns={columns}
                    onChange={onChange}
                    onSave={onSave}
                    onContextMenu={onContextMenu}
                    selected={selectedPostIds.includes(row.id)}
                  />
                )
              })
            }
            </TableBody>
        </Table>
        <DashboardPagination getNextPage={getNextPage} />
      </Paper>
    </div>
  )
}

DashboardTable.defaultProps = {
  selectedPostIds: [],
  placeholders: new Array(10).fill(0).map(_ => (<Skeleton variant="rect" width={175} height={40} />))
}

export default DashboardTable
