import React from 'react'
import FormControl from '@material-ui/core/FormControl'
import InputBase from '@material-ui/core/InputBase'
import InputLabel from '@material-ui/core/InputLabel'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  root: {},
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.common.white,
    border: '1px solid #e8e8e8',
    fontSize: 16,
    // width: 'auto',
    padding: '10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#2f54eb',
      // boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    }
  },
  label: {
    fontSize: 18
  }
})

const Input = props => {
  const { label, classes, ...rest } = props

  return (
    <FormControl className={classes.margin}>
      <InputLabel shrink className={classes.label}>
        {label}
      </InputLabel>
      <InputBase
        {...rest}
        classes={{
          root: classes.root,
          input: classes.input
        }}
      />
    </FormControl>
  )
}

export default withStyles(styles)(Input)
