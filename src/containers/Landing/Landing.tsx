import React from 'react' 
import { Typography } from '@material-ui/core'
import { AppWrapper } from '@contentkit/components'
import { makeStyles } from '@material-ui/styles'
import TopBar from '../../components/TopBar'
import { useSnackbar } from 'notistack'

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  text: {
    color: '#718096'
  }
}))


function Landing (props) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const classes = useStyles(props)
 
  return (
    <AppWrapper
      classes={{}}
      disablePadding
      renderToolbar={() => <TopBar />} 
    >
      <div className={classes.container}>
        <Typography className={classes.text}>Something went wrong.</Typography>
      </div>
    </AppWrapper>
  )
}

export default Landing
