import React from 'react'
import { withStyles } from '@material-ui/core/styles'

const styles = {
  footer: {
    height: 300,
    backgroundColor: '#2f54eb',
    width: '100%',
    left: 0,
    right: 0
  }
}

class Footer extends React.Component {
  render () {
    const { classes } = this.props
    return (
      <footer className={classes.footer} />
    )
  }
}

export default withStyles(styles)(Footer)
