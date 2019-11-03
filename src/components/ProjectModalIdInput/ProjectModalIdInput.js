import React from 'react'
import Input from '../Input'
import { FileCopy } from '@material-ui/icons'
import { IconButton, InputAdornment } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
  input: {
    marginBottom: 15
  },
  button: {
    marginRight: 8
  }
}))

function ProjectModalIdInput (props) {
  const {
    onCopy,
    setRef,
    value
  } = props
  const classes = useStyles(props)
  return (
    <Input
      className={classes.input}
      value={value}
      inputRef={setRef}
      endAdornment={
        <InputAdornment position='end'>
          <IconButton
            edge='end'
            size='small'
            onClick={onCopy}
            onMouseDown={onCopy}
            className={classes.button}

          >
            <FileCopy />
          </IconButton>
        </InputAdornment>
      }
    />
  )
}

export default ProjectModalIdInput
