// @flow
import React from 'react'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'

export default withStyles(
  theme => ({
    paper: {
      marginBottom: '1em',
      padding: '20px'
    }
  })
)(({ classes, children }) => (
  <Paper elevation={0} className={classes.paper}>
    {children}
  </Paper>
))
