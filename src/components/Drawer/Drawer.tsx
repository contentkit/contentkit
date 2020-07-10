import { makeStyles } from '@material-ui/styles'
import React from 'react'
import { Slide, Paper, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: 'fixed',
    top: 0,
    left: 60,
    bottom: 0,
    width: 400,
    backgroundColor: '#2D3748',
    opacity: 0.85,
    zIndex: theme.zIndex.appBar
  },
  inner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxSizing: 'border-box',
    // @ts-ignore
    padding: theme.spacing(3),
    justifyContent: 'space-between',
    height: '100%'
  }
}))

type CustomSwipeableDrawerProps = {
  open: boolean
  onClose: () => void
}

function Drawer (props: any) {
  const { open, children } = props
  const classes = useStyles(props)
  return (
    <Slide in={open} unmountOnExit mountOnEnter direction='right'>
      <Paper className={classes.root} elevation={1} square>
        <div className={classes.inner}>
          {children}
        </div>
      </Paper>
    </Slide>
  )
}

export default Drawer
