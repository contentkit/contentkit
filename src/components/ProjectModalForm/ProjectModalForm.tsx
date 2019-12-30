import React from 'react'
import PropTypes from 'prop-types'
import { Input } from '@contentkit/components'

function ProjectModalForm ({ classes, project, onChange }) {
  return (
    <div
      className={classes.formControl}
    >
      <Input
        className={classes.input}
        value={project.name}
        onChange={evt =>
          onChange({ name: evt.target.value })
        }
      />
    </div>
  )
}

ProjectModalForm.propTypes = {
  project: PropTypes.object,
  onChange: PropTypes.func.isRequired
}

export default ProjectModalForm
