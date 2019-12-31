import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme: any) => ({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f4f4f4',
    position: 'absolute',
    boxSizing: 'border-box',
    color: '#41404F',
    fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol',
    fontSize: '14px',
    lineHeight: 1.5,
    [theme.breakpoints.up('sm')]: {
      padding: '8%'
    }
  },
  inset: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    placeContent: 'center space-between',
    backgroundColor: '#fff'
  },
  left: {
    padding: '100px 40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    boxSizing: 'border-box',
    [theme.breakpoints.down('md')]: {
      width: '100%'
    },
    [theme.breakpoints.up('md')]: {
      width: 400
    }
  },
  right: {
    backgroundColor: '#393939',
    [theme.breakpoints.down('md')]: {
      display: 'none'
    },
    [theme.breakpoints.up('md')]: {
      backgroundClip: 'border-box',
      width: 'calc(100% - 400px)',
      overflowY: 'hidden'
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
  spaceBetween: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  spacer: {
    height: '40px',
    width: '100%'
  }
}))

export default useStyles
