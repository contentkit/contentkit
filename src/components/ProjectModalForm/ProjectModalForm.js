// @flow
import React from 'react'
import PropTypes from 'prop-types'
import Input from 'antd/lib/input'

const ProjectModalForm = ({ classes, Project, onChange }) => (
  <div
    className={classes.formControl}
  >
    <Input
      className={classes.input}
      value={Project.name}
      onChange={evt =>
        onChange({ name: evt.target.value })
      }
    />
  </div>
)

export default ProjectModalForm
