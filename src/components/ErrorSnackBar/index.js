import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Snackbar from '@material-ui/core/Snackbar'

const styles = theme => ({
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4
  }
})

class ErrorSnackbar extends React.PureComponent {
  render () {
    const { errorMessage, open } = this.props
    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          open={open}
          autoHideDuration={2000}
          SnackbarContentProps={{
            'aria-describedby': 'message-id'
          }}
          message={
            <span id='message-id'>{errorMessage}</span>
          }
        />
      </div>
    )
  }
}

ErrorSnackbar.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ErrorSnackbar)
