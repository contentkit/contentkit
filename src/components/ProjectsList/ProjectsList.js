// @flow
import React from 'react'
import PropTypes from 'prop-types'
import MenuList from '@material-ui/core/MenuList'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'
import ProjectsListItem from '../ProjectsListItem'

const styles = theme => ({
  paper: {
    borderRadius: '5px',
    boxShadow: 'rgba(8, 35, 51, 0.03) 0px 0px 2px, rgba(8, 35, 51, 0.05) 0px 3px 6px'
  }
})

const ProjectsList = ({
  allProjects,
  handleClick,
  onMouseEnter,
  onMouseLeave,
  classes
}) => (
  <Paper elevation={0} className={classes.paper}>
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
