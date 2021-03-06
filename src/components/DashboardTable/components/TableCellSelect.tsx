import React from 'react'
import { InputBase, Select, InputAdornment, IconButton } from '@material-ui/core'
import { ChevronDown, SaveIcon, EditIcon } from './Icons'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: 'transparent',
    border: 'none',
    maxWidth: 123
  },
  icon: {
    color: 'rgba(0, 0, 0, 0.54)',
    position: 'absolute',
    pointerEvents: 'none',
    right: 50
  },
  flex: {
    width: 163,
    display: 'flex',
    flex: 1,
    // @ts-ignore
    // marginRight: (props: any) => props.isEditing ? 0 : 40 
  },
  button: {
    // position: 'absolute',
    // height: 46,
    // width: 46,
    // right: 0,
    // top: 0
  }
}))

function TableCellSelect (props) {
  const classes = useStyles(props)
  const {
    onBlur,
    isEditing,
    value,
    onChange,
    onClick,
    getOptions,
    hovering
  } = props
  const options = getOptions(props)

  const onClickSelect = (evt) => {
    if (isEditing) return
    onClick(evt)
  }

  const button = (
    <IconButton onClick={onClick} className={classes.button}>
      {isEditing ? <SaveIcon /> : <EditIcon />}
    </IconButton>
  )

  return (
    <div className={classes.flex} onClick={onClickSelect}>
      <Select
        onClick={onClickSelect}
        native
        value={value}
        onChange={onChange}
        // IconComponent={() => (<ChevronDown className={classes.icon} />)}
        input={(<InputBase onBlur={onBlur} classes={{ root: classes.root }} />)}
        disabled={!isEditing}
        classes={{
          root: classes.root,
        }}
      >
        {
          options.map(option => (<option key={option.key} value={option.key}>{option.label}</option>))
        }
      </Select>
      {isEditing && button}
    </div>
  )
}

export default TableCellSelect
