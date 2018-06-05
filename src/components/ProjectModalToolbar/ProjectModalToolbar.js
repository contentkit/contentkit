// @flow
import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Toolbar from '@material-ui/core/Toolbar'

const ProjectModalToolbar = ({
  classes,
  handleSave,
  handleDelete,
  handleClose
}) => (
  <Toolbar disableGutters style={{justifyContent: 'space-between'}}>
    <Button
      className={classes.button}
      variant='flat'
      color='secondary'
      onClick={handleDelete}>
        Delete
    </Button>
    <div>
      <Button
        className={classes.button}
        variant='raised'
        color='secondary'
        onClick={() => handleClose()}>
          Close
      </Button>
      <Button
        variant='raised'
        color='primary'
        onClick={handleSave}>
          Save
      </Button>
    </div>
  </Toolbar>
)

export default ProjectModalToolbar
