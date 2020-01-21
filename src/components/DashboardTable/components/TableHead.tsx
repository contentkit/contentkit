import React from 'react'
import { TableHead, TableRow, TableCell, TableSortLabel } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { SortUp, SortDown } from './Icons'

type Direction = 'asc' | 'desc'

const useStyles = makeStyles(theme => ({
  tableHeadCell: {
    backgroundColor: '#e0e0e0'
  }
}))

function DashboardTableHead (props) {
  const { columns, sort, onSort } = props
  const classes = useStyles(props)

  return (
    <TableHead>
      <TableRow>
        <TableCell key='checkbox' className={classes.tableHeadCell} padding='checkbox' />
        {columns.map(column =>
          <TableCell
            key={`tc_${column.key}`}
            className={classes.tableHeadCell}
            sortDirection={sort.direction}
          >
            <TableSortLabel
              IconComponent={SortDown}
              active={sort.column === column.key}
              direction={sort.direction as Direction}
              onClick={onSort(column)}
            >
              {column.title}
            </TableSortLabel>
          </TableCell>  
        )}
      </TableRow>
    </TableHead>
  )
}

export default DashboardTableHead
