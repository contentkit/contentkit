// @flow
import React from 'react'
import PropTypes from 'prop-types'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'

const ProjectModalForm = ({ classes, Project, onChange }) => (
  <FormControl
    margin='normal'
    className={classes.formControl}
  >
    <InputLabel htmlFor='project-name'>Project Name</InputLabel>
    <Input
      className={classes.input}
      disableUnderline
      id='project-name'
      value={Project.name}
      onChange={evt =>
        onChange({ name: evt.target.value })
      }
    />
  </FormControl>
)

export default ProjectModalForm
