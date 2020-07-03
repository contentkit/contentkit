import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: '100vh',
    paddingTop: 48,
    boxSizing: 'border-box'
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
    width: 'calc(100% - 80px)',
    minHeight: 'calc(100vh - 124px)',
    marginLeft: '40px',
    padding: '30px',
    boxSizing: 'border-box',
    backgroundColor: '#fff',
    borderRadius: 8,
    boxShadow: '0px 4px 8px rgba(60,45,111,0.1), 0px 1px 3px rgba(60,45,111,0.15)'
  },
  drag: {
    borderColor: '#ccc',
    background: '#dbdbdb',
    backgroundImage: 'linear-gradient(-45deg,#d2d2d2 25%,transparent 25%,transparent 50%,#d2d2d2 50%,#d2d2d2 75%,transparent 75%,transparent)',
    backgroundSize: '40px 40px',
  }
}))

export default useStyles
