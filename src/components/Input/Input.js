import { InputBase } from '@material-ui/core'
import { withStyles } from '@material-ui/styles'

const Input = withStyles(theme => ({
  root: {

    // border: props => props.adorned ? 'none' : '1px solid #ced4da',
    width: '100%',
    'label + &': {
      marginTop: theme.spacing(3)
    }
  },
  input: {
    backgroundColor: '#f4f4f4',
    border: 'none',
    // border: '2px solid #ced4da',
    // border: props => props.adorned ? '1px solid #ced4da' : 'none',
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
      outline: '2px solid #0f62fe'
      // borderColor: '#80bdff',
      // boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    }
  }
}))(InputBase)

export default Input
