// @flow
import React from 'react'
import PropTypes from 'prop-types'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ProjectAvatar from '../ProjectsListItemAvatar'

const ProjectsListItem = (props: any) => (
  <div
    onMouseEnter={evt => {
      props.onMouseEnter(props.project.id)
    }}
    onMouseLeave={evt => {
      props.onMouseLeave(props.project.id)
    }}
  >
    <MenuItem
      onClick={() => props.handleClick(props.project.id)}
    >
      <ListItemIcon>
        <ProjectAvatar id={props.project.id} />
      </ListItemIcon>
      <ListItemText inset primary={<span>{props.project.name}</span>} secondary={<span>Posts</span>} />
    </MenuItem>
  </div>
)

ProjectsListItem.defaultProps = {
  handleClick: () => {},
  onMouseEnter: () => {},
  onMouseLeave: () => {},
  project: {
    id: 1,
    name: ''
  }
}

export default ProjectsListItem
