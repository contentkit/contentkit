// @flow
import React from 'react'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'

const withStylesProps = styles =>
  Component =>
    props => {
      const Comp = withStyles(styles(props))(Component)
      return <Comp {...props} />
    }

const styles = props => theme => ({
  paper: {
    marginBottom: '1em',
    padding: '20px',
    boxShadow: 'rgba(8, 35, 51, 0.03) 0px 0px 2px, rgba(8, 35, 51, 0.05) 0px 3px 6px',
    ...(props.styles || {})
  }
})

export default withStylesProps(styles)(({ classes, children }) => (
  <Paper elevation={0} className={classes.paper}>
    {children}
  </Paper>
))
