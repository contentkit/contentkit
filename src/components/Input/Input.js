import React from 'react'
import { InputBase } from '@material-ui/core'
import { withStyles, makeStyles } from '@material-ui/styles'
import clsx from 'clsx'

export const StyledInputBase = withStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: '#f4f4f4',
    border: '2px solid #f4f4f4',
    'label + &': {
      marginTop: theme.spacing(3)
    }
  },
  input: {
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: 0,
    position: 'relative',
    fontSize: 14,
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

export default StyledInputBase
