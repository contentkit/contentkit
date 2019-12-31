import React from 'react'
import { InputAdornment, IconButton } from '@material-ui/core'
import { Input } from '@contentkit/components'
import { SaveIcon, EditIcon } from './Icons'

function TableCellInput (props) {
  const ref = React.useRef(null)
  const {
    onBlur,
    isEditing,
    value,
    onChange,
    onClick,
    isHovering,
    classes
  } = props

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

export default TableCellInput
