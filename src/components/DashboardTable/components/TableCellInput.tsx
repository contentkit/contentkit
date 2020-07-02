import React from 'react'
import { InputAdornment, IconButton, Typography } from '@material-ui/core'
import { Input } from '@contentkit/components'
import { SaveIcon, EditIcon } from './Icons'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
  input: {
    backgroundColor: 'transparent',
    border: 'none'
  },
  flex: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between'
  },
  link: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.87)',
  },
  adornment: {}
}))

function TableCellInput (props) {
  const ref = React.useRef(null)
  const classes = useStyles(props)
  const {
    onBlur,
    isEditing,
    value,
    onChange,
    onClick,
    hovering,
    slug
  } = props

  React.useEffect(() => {
    if (isEditing) {
      ref.current.focus()
    }
  }, [isEditing])

  const onKeyDown = (evt) => {
    switch (evt.key) {
      case 'Enter':
        onClick(evt)
    }
  }

  const button = (
    <IconButton onClick={onClick} size='small'>
      {isEditing ? <SaveIcon /> : <EditIcon />}
    </IconButton>
  )

  if (!isEditing) {
    return (
      <div className={classes.flex} onClick={onClick}>
        <Typography variant='body2'>
          {slug ? <a href={slug} className={classes.link}>{value}</a> : value}
        </Typography>
      </div>
    )
  }
  return (
    <Input
      inputRef={ref}
      autoFocus={isEditing}      
      disabled={!isEditing}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      classes={{
        root: classes.input
      }}
      endAdornment={
        (
          <InputAdornment position='end' className={classes.adornment}>
            {button}
          </InputAdornment>
        )
      }
    />
  )
}

export default TableCellInput
