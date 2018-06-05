// @flow
import React from 'react'
import PropTypes from 'prop-types'
import MenuList from '@material-ui/core/MenuList'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'
import ProjectsListItem from '../ProjectsListItem'

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

const ProjectsList = ({
  allProjects,
  handleClick,
  onMouseEnter,
  onMouseLeave
}) => (
  <Paper elevation={0}>
    <MenuList>
      {allProjects.map(project =>
        <ProjectsListItem
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

ProjectsList.defaultProps = {
  allProjects: [],
  handleClick: () => {},
  onMouseEnter: () => {},
  onMouseLeave: () => {}
}

ProjectsList.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ProjectsList)
