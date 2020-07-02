import React from 'react'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    width: '100%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#2D3748'
  }
}))


function TopBar (props) {
  const classes = useStyles(props)
  return (
    <div className={classes.root}>

    </div>
  )
}

export default TopBar
