// @flow
import React from 'react'
import PropTypes from 'prop-types'
import MenuList from '@material-ui/core/MenuList'
import MenuItem from '@material-ui/core/MenuItem'

import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'

import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ProjectAvatar from './ProjectAvatar'

const Project = (props) => (
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
      <ListItemText inset primary={props.project.name} secondary={'Posts'} />
    </MenuItem>
  </div>
)

Project.defaultProps = {
  handleClick: () => {},
  onMouseEnter: () => {},
  onMouseLeave: () => {},
  project: {
    id: 1,
    name: ''
  }
}

const styles = theme => ({
  menuItem: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& $primary, & $icon': {
        color: theme.palette.common.white
      }
    }
  },
  primary: {},
  icon: {}
})

const ProjectList = ({
  allProjects,
  handleClick,
  onMouseEnter,
  onMouseLeave
}) => (
  <Paper elevation={0}>
    <MenuList>
      {allProjects.map(project =>
        <Project
          project={project}
          key={project.id}
          handleClick={handleClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
      )}
    </MenuList>
  </Paper>
)

ProjectList.defaultProps = {
  allProjects: [],
  handleClick: () => {},
  onMouseEnter: () => {},
  onMouseLeave: () => {}
}

ProjectList.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ProjectList)
