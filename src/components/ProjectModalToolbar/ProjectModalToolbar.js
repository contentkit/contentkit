// @flow
import React from 'react'
import PropTypes from 'prop-types'
import { Button, Toolbar } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between'
  }
}))

function ProjectModalToolbar (props) {
  const {
    handleSave,
    handleDelete,
    handleClose
  } = props
  const classes = useStyles(props)
  return (
    <Toolbar className={classes.root}>
      <Button
        className={classes.button}
        onClick={handleDelete}>
          Delete
      </Button>
      <div>
        <Button
          className={classes.button}
          onClick={() => handleClose()}
        >
            Close
        </Button>
        <Button onClick={handleSave}>
          Save
        </Button>
      </div>
    </Toolbar>
  )
}

ProjectModalToolbar.propTypes = {
  handleSave: PropTypes.func,
  handleDelete: PropTypes.func,
  handleClose: PropTypes.func
}

export default ProjectModalToolbar
