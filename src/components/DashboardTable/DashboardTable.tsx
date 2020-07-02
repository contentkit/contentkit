import React from 'react'

import { useApolloClient } from '@apollo/client'
import { Fade, Paper, TableBody, Table, CircularProgress } from '@material-ui/core'
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
    getToolbarProps,
    renderToolbar,
    settings
  } = props
  console.log(posts)
  // const [togglePost] = useMutation(gql`
  //   mutation($id: String!) {
  //     togglePost(id: $id) @client
  //   }
  // `)
  const classes = useStyles(props)
  const client = useApolloClient()
  const onSave = useOnSave()
  const [offset, setOffset] = React.useState(0)
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
    })
  }

  const getNextPage = (direction: PaginationDirection) => {
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

  const dataSource = React.useMemo(() => {
    return (posts?.data?.posts_aggregate?.nodes || [])
      .slice(offset, offset + 10)
      .map(row => ({ ...row, key: row.id }))
  }, [offset, posts])
 
  const toolbarProps = getToolbarProps()
  return (
    <div className={classes.wrapper}>
      <Paper elevation={0} className={classes.paper}>
        {renderToolbar(toolbarProps)}
        <Fade in={searchLoading} unmountOnExit mountOnEnter>
          <div className={classes.progress}>
            <CircularProgress />
          </div>
        </Fade>
        <Fade in={!searchLoading} unmountOnExit mountOnEnter>
          <Table size='small' className={classes.table}>
            <DashboardTableHead sort={sort} onSort={onSort} columns={columns} />
              <TableBody>
                {
                  orderBy(dataSource, [sort.column], [sort.direction]).map(row => {
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
        </Fade>
        <DashboardPagination getNextPage={getNextPage} />
      </Paper>
    </div>
  )
}

DashboardTable.defaultProps = {
  selectedPostIds: []
}

export default DashboardTable
