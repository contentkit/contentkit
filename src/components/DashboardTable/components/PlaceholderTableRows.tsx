import React from 'react'
import { TableCell, TableRow } from '@material-ui/core'
import { CheckBoxOutlineBlank } from '@material-ui/icons'
import { Skeleton } from '@material-ui/lab'

function PlaceholderTableRows (props) {
  const { classes } = props
  const placeholders = new Array(10).fill(0).map(_ => (<Skeleton variant="rect" width={175} height={40} />))
  return (
    placeholders.map(placeholder => (
      <TableRow>
        <TableCell>
          <CheckBoxOutlineBlank className={classes.checkbox} />
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
  )
}

// @ts-ignore
export default React.memo(PlaceholderTableRows)

