import React from 'react'
// @ts-ignore
import { CircularProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
}))

function Progress (props) {
  const classes = useStyles(props)

  return (
    <div className={classes.root}>
      <div>
        <CircularProgress />
      </div>
    </div>
  )
}

Progress.propTypes = {}

Progress.defaultProps = {}

export default Progress
