import React from 'react'
import PropTypes from 'prop-types'
import { Box, TextField } from '@material-ui/core'

type ProjectModalFormProps = {
  onChange: ({ name: string }) => void,
  project: { name: string },
  classes: {
    formControl: string,
    input: string
  }
}

function ProjectModalForm (props: ProjectModalFormProps) {
  const { project, onChange } = props
  return (
    <Box mb={2}>
      <TextField
        value={project.name}
        onChange={evt =>
          onChange({ name: evt.target.value })
        }
        variant='outlined'
        margin='dense'
        label='Project name'
        fullWidth
      />
    </Box>
  )
}

ProjectModalForm.propTypes = {
  project: PropTypes.object,
  onChange: PropTypes.func.isRequired
}

export default ProjectModalForm
