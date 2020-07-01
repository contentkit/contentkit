import React from 'react'
import { TableRow, TableCell } from '@material-ui/core'
import { Checkbox } from '@contentkit/components'
import EditableCell from './EditableCell'
import { GraphQL } from '../../../types'
import { Column } from '../types'

type Row = {
  id: string,
  project: {
    id: string
  }
}

type OnSaveOptions = Pick<Row, 'id'> & { project_id: string }

type DashboardTableRowProps = {
  row: GraphQL.Post,
  className: string,
  selectRow: (id: string) => void,
  selectedPostIds: string[],
  columns: Column[],
  classes: any,
  onChange: (post: GraphQL.Post, key: string, value: string) => void,
  onContextMenu: (evt: any, row: GraphQL.Post) => void,
  onSave: (options: OnSaveOptions) => void
}

function DashboardTableRow (props: DashboardTableRowProps) {
  const {
    row,
    className,
    selectRow,
    selectedPostIds,
    columns,
    classes,
    onChange,
    onContextMenu,
    onSave
  } = props
  const [columnKey, setColumnKey] = React.useState(null)

  function toggleEditing (row: GraphQL.Post, column: Column) {
    if (columnKey === column.key) {
      setColumnKey(null)
      onSave({ ...row, project_id: row.project.id })
    } else {
      setColumnKey(column.key)
    }
  }

  const handleContextMenu = (evt: any) => {
    evt.preventDefault()
    onContextMenu(evt, row)
  }

  const handleSelectRow = (evt: any) => {
    selectRow(row.id)
  }

  const getKey = (column: Column) => {
    return `${row.id}-${column.key}`
  }

  return (
    <TableRow
      className={className}
      onContextMenu={handleContextMenu}
    >
      <TableCell className={classes.checkboxTableCell}>
        <Checkbox
          value={row.id}
          checked={selectedPostIds.includes(row.id)}
          id={`checkbox_${row.id}`}
          onChange={handleSelectRow}
        />
      </TableCell>
      {columns.map(column => (
        <EditableCell
          key={getKey(column)}
          toggleEditing={toggleEditing}
          isEditing={column.key === columnKey}
          column={column}
          row={row}
          onChange={onChange}
          onSave={onSave}
        />
      ))}
    </TableRow>
  )
}

export default DashboardTableRow
