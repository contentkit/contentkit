import React from 'react'
import { FileCopy } from '@material-ui/icons'
import { Box, TextField, IconButton, InputAdornment } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
  input: {
    marginBottom: 15
  },
  button: {
    marginRight: 8
  }
}))

type ProjectModalIdInputProps = {
  onCopy: (evt: any) => void,
  value: string
}

const ProjectModalIdInput = React.forwardRef((props: ProjectModalIdInputProps, ref) => {
  const {
    onCopy,
    value
  } = props
  const classes = useStyles(props)
  return (
    <Box mb={2}>
      <TextField
        value={value}
        inputRef={ref}
        variant='outlined'
        margin='dense'
        label='API key'
        fullWidth
        InputProps={{
          endAdornment: (
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
          )
        }}
      />
    </Box>
  )
})

export default ProjectModalIdInput
