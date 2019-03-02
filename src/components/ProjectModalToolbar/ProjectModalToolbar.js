// @flow
import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Toolbar from '@material-ui/core/Toolbar'

type Props = {
  classes: any,
  handleSave: () => void,
  handleDelete: () => void,
  handleClose: () => void
}

const ProjectModalToolbar = (props: Props) => {
  const {
    classes,
    handleSave,
    handleDelete,
    handleClose
  } = props
  return (
    <Toolbar disableGutters style={{ justifyContent: 'space-between' }}>
      <Button
        className={classes.button}
        variant='text'
        color='secondary'
        onClick={handleDelete}>
          Delete
      </Button>
      <div>
        <Button
          className={classes.button}
          variant='contained'
          color='secondary'
          onClick={() => handleClose()}>
            Close
        </Button>
        <Button
          variant='contained'
          color='primary'
          onClick={handleSave}>
            Save
        </Button>
      </div>
    </Toolbar>
  )
}

ProjectModalToolbar.propTypes = {
  classes: PropTypes.object,
  handleSave: PropTypes.func,
  handleDelete: PropTypes.func,
  handleClose: PropTypes.func
}

export default ProjectModalToolbar
