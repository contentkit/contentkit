// @flow
import React from 'react'
import PropTypes from 'prop-types'
import Button from 'antd/lib/button'
import classes from './styles.scss'

const ProjectModalToolbar = (props) => {
  const {
    classes,
    handleSave,
    handleDelete,
    handleClose
  } = props
  return (
    <div className={classes.root}>
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
        <Button
          onClick={handleSave}
        >
            Save
        </Button>
      </div>
    </div>
  )
}

ProjectModalToolbar.propTypes = {
  classes: PropTypes.object,
  handleSave: PropTypes.func,
  handleDelete: PropTypes.func,
  handleClose: PropTypes.func
}

export default ProjectModalToolbar
