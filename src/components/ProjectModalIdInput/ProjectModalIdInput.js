// @flow
import React from 'react'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import ClipboardIcon from '@material-ui/icons/es/ContentCopy'
import IconButton from '@material-ui/core/IconButton'
import FormControl from '@material-ui/core/FormControl'

function ProjectModalIdInput (props: any) {
  const {
    onCopy,
    setRef,
    classes,
    value
  } = props
  return (
    <FormControl fullWidth margin='normal'>
      <InputLabel htmlFor='project-id'>Project ID</InputLabel>
      <Input
        className={classes.input}
        disableUnderline
        id='project-id'
        value={value}
        inputRef={setRef}
        endAdornment={
          <InputAdornment position='end'>
            <IconButton
              onClick={onCopy}
              onMouseDown={onCopy}
            >
              <ClipboardIcon />
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  )
}

export default ProjectModalIdInput
