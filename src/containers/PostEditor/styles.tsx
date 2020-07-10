import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
  content: {
  },
  button: {
    color: '#A0AEC0'
  },
  iconButton: {
    padding: '0px !important'
  },
  listItem: {
    display: 'inline-flex',
    justifyContent: 'center',
    height: 50,
    width: 50,
    margin: 5,
    '& > img': {
      margin: 0
    }
  },
  divider: {
    borderColor: '#2D3748'
  }
}))

export default useStyles
