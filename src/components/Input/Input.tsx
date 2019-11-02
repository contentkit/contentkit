import React from 'react'
import { InputBase, Paper } from '@material-ui/core'
import { withStyles, makeStyles } from '@material-ui/styles'
import { classes } from 'istanbul-lib-coverage'

const StyledInputBase = withStyles(theme => ({
  root: {
    width: '100%',
    'label + &': {
      marginTop: theme.spacing(3)
    }
  },
  input: {
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: 0,
    position: 'relative',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
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
      borderRadius: 0,
    }
  }
}))(InputBase)

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#f4f4f4',
    border: '2px solid #f4f4f4',
    '&:focus-within': {
      borderRadius: 0,
      border: '2px solid #0f62fe'
    }
  }
}))

function Input (props) {
  const classes = useStyles(props)
  return (   
    <Paper elevation={0} className={classes.root} square>
      <StyledInputBase
        {...props}
      />
    </Paper>
  )
}

export default Input
