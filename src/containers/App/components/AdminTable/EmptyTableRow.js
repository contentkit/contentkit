// @flow

import React from 'react'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'

const emptyCellStyles = {
  width: '100%',
  height: '25px',
  backgroundColor: '#fafafa',
  borderRadius: '5px'
}

const EmptyCell = props => (
  <TableCell padding='dense'>
    <div style={emptyCellStyles} />
  </TableCell>
)

const EmptyTableRow = props => (
  <TableRow id={props.edge ? 'edge' : undefined}>
    {props.cells.map((_, i) => <EmptyCell key={i} />)}
  </TableRow>
)

EmptyTableRow.defaultProps = {
  cells: [0, 0, 0, 0, 0],
  edge: false
}

export default EmptyTableRow
