import React from 'react'
import Avatar from 'antd/lib/avatar'

const ProjectsListItemAvatar = ({ id }) => {
  return (
    <Avatar
      src={'https://avatar.tobi.sh/' + id}
      style={{ width: '35px', height: '35px' }}
    />
  )
}

ProjectsListItemAvatar.defaultProps = {
  id: Math.random().toString(36).substring(7)
}

export default ProjectsListItemAvatar
