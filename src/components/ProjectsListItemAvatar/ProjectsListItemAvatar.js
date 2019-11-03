import React from 'react'
import PropTypes from 'prop-types'
import { Avatar } from '@material-ui/core'

function ProjectsListItemAvatar ({ id }) {
  return (
    <Avatar
      src={'https://avatar.tobi.sh/' + id}
      style={{ width: '35px', height: '35px' }}
    />
  )
}

ProjectsListItemAvatar.propTypes = {
  id: PropTypes.string
}

ProjectsListItemAvatar.defaultProps = {
  id: Math.random().toString(36).substring(7)
}

export default ProjectsListItemAvatar
