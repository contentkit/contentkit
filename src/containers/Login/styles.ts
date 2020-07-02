import { makeStyles } from '@material-ui/styles'
import mesh from './mesh.svg'

const useStyles = makeStyles((theme: any) => ({
  container: {
    background: `url(${mesh}) center -58px no-repeat, linear-gradient(180deg,#1a202c 0%,#2d3646 100%),#1a202c`,
    width: '100%',
    height: '100%',
    backgroundColor: '#f4f4f4',
    position: 'absolute',
    boxSizing: 'border-box',
    color: '#41404F',
    fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol',
    fontSize: '14px',
    lineHeight: 1.5,
    [`${theme.breakpoints.up('md')} and (-webkit-max-device-pixel-ratio: 2)`]: {
      padding: '8%'
    }
  },
  inset: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progress: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: 'translateX(-50%)'
  },
  paper: {
    position: 'relative',
    background: '#2D3748',
    boxShadow: '0px 1px 3px rgba(0,0,0,0.25)',
    padding: '100px 40px 120px 40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    boxSizing: 'border-box',
    color: '#E2E8F0',
    [theme.breakpoints.down('md')]: {
      width: '100%'
    },
    [`${theme.breakpoints.up('md')} and (-webkit-max-device-pixel-ratio: 2)`]: {
      width: 400
    }
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    height: '100%'
  },
  button: {
    maxWidth: 160
  },
  'gutter-20': {
    marginBottom: 20
  },
  'gutter-40': {
    marginBottom: 40
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 40
  },
  spacer: {
    height: '40px',
    width: '100%'
  }
}))

export default useStyles
