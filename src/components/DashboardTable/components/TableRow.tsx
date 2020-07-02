import React from 'react'
import { Checkbox, TableRow, TableCell } from '@material-ui/core'
import clsx from 'clsx'
import EditableCell from './EditableCell'
import { GraphQL } from '../../../types'
import { Column } from '../types'
import { makeStyles } from '@material-ui/styles'

type Row = {
  id: string,
  project: {
    id: string
  }
}

type OnSaveOptions = Pick<Row, 'id'> & { project_id: string }

type DashboardTableRowProps = {
  row: GraphQL.Post,
  selectRow: (id: string) => void,
  selectedPostIds: string[],
  columns: Column[],
  onChange: (post: GraphQL.Post, key: string, value: string) => void,
  onContextMenu: (evt: any, row: GraphQL.Post) => void,
  onSave: (options: OnSaveOptions) => void
  selected: boolean
}

const useStyles = makeStyles(theme => ({
  root: {

  },
  selected: {

  },
  tableCell: {
    borderBottom: '1px solid #e0e0e0',
    backgroundColor: (props: any) => props.selected ? '#ebf8ff' : '#fff'
  },
  checkbox: {
    color: '#a0aec0'
  },
  checked: {},
  colorSecondary: {
    color: '#8fa6b2',
    '&:$checked': {
      color: '#8fa6b2'
    }
  }
}))

function DashboardTableRow (props: DashboardTableRowProps) {
  const classes = useStyles(props)
  const {
    row,
    selected,
    selectRow,
    selectedPostIds,
    columns,
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

  const className = clsx(classes.root, {
    [classes.selected]: selected
  })
  return (
    <TableRow
      className={className}
      onContextMenu={handleContextMenu}
    >
      <TableCell className={classes.tableCell}>
        <Checkbox
          value={row.id}
          checked={selectedPostIds.includes(row.id)}
          id={`checkbox_${row.id}`}
          onChange={handleSelectRow}
          classes={{
            root: classes.checkbox,
            colorSecondary: classes.colorSecondary,
            checked: classes.colorSecondary
          }}
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
          selected={selected}
        />
      ))}
    </TableRow>
  )
}

export default DashboardTableRow
