import React from 'react'
import { Select, InputAdornment, IconButton } from '@material-ui/core'
import { ChevronDown, SaveIcon, EditIcon } from './Icons'
import { Input } from '@contentkit/components'

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

export default TableCellSelect
