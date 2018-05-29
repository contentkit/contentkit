// @flow
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

function NewProjectSnackbar (props) {
  const { classes, open, newProjectName } = props /* eslint-disable-line */
  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        open={open}
        autoHideDuration={2000}
        message={
          <span id='message-id'>Creating a new project {newProjectName}</span>
        }
      />
    </div>
  )
}

NewProjectSnackbar.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(NewProjectSnackbar)
