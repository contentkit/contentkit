import React from 'react'
import PropTypes from 'prop-types'
import { Input } from '@contentkit/components'

type ProjectModalFormProps = {

}

function ProjectModalForm (props) {
  const { classes, project, onChange } = props
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
