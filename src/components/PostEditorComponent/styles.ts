import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: 48,
    left: 60,
    right: 0,
    bottom: 0,
    backgroundColor: '#f5f5f5'
  },
  progress: {
    position: 'absolute',
    left: 0,
    right: 0,
    width: '100%',
    height: 5,
    top: 48,
    zIndex: 10
  },
  editor: {
    width: '100%',
    padding: '40px',
    boxSizing: 'border-box',
    backgroundColor: '#f5f5f5'
  },
  drag: {
    borderColor: '#ccc',
    background: '#dbdbdb',
    backgroundImage: 'linear-gradient(-45deg,#d2d2d2 25%,transparent 25%,transparent 50%,#d2d2d2 50%,#d2d2d2 75%,transparent 75%,transparent)',
    backgroundSize: '40px 40px',
  }
}))

export default useStyles
