import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { TableCell } from '@material-ui/core'
import { GraphQL } from '../../../types'
import { Column } from '../types'

const useEditableCellStyles = makeStyles(theme => ({
  tableCell: {
    position: 'relative',
    backgroundColor: '#fff',
    // backgroundColor: '#f4f4f4',
    borderBottom: '1px solid #e0e0e0',
    '&:hover $button': {
      visibility: 'visible'
    },
    '&:hover': {
      backgroundColor: '#e0e0e0'
    }
  },
  icon: {
    color: 'rgba(0, 0, 0, 0.54)',
    position: 'absolute',
    pointerEvents: 'none',
    right: 50
  },
  button: {}
}))

type EditableCellProps = {
  row: GraphQL.Post,
  column: Column,
  onChange: (post: GraphQL.Post, key: string, value: string) => void,
  toggleEditing: (post: GraphQL.Post, column: Column) => void,
  onSave: any,
  isEditing: boolean
}

function EditableCell (props: EditableCellProps) {
  const classes = useEditableCellStyles(props)
  const {
    row,
    column,
    onChange,
    toggleEditing,
    isEditing,
    onSave
  } = props
  const [hovering, setHovering] = React.useState(false)

  const onClick = (evt: any) => {
    toggleEditing(row, column)
  }

  const handleChange = (evt: any) => {
    onChange(row, column.key, evt.target.value)
  }

  const onMouseEnter = evt => {
    setHovering(true)
  }

  const onMouseLeave = evt => {
    setHovering(false)
  }

  const [value] = column.render(row)
  const { Component } = column
  const content = column.editable
    ? <Component
        raw={row[column.key]}
        value={value}
        onChange={handleChange}
        isEditing={isEditing}
        onClick={onClick}
        getOptions={column.getOptions}
        classes={classes}
        hovering={hovering}
        {...(typeof column.getProps === 'function' ? column.getProps(row) : {})}
      />
    : value
  return (
    <TableCell
      key={column.key}
      className={classes.tableCell}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {content}
    </TableCell>
  )
}

export default EditableCell
