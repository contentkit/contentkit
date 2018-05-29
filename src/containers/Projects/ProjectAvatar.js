// @flow
import React from 'react'
import Avatar from '@material-ui/core/Avatar'

const ProjectAvatar = ({ id }: { id: string }) => {
  return (
    <Avatar
      src={'https://avatar.tobi.sh/' + id}
      style={{width: '35px', height: '35px'}}
    />
  )
}

ProjectAvatar.defaultProps = {
  id: Math.random().toString(36).substring(7)
}

export default ProjectAvatar
