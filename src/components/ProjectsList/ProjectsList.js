import React from 'react'
import PropTypes from 'prop-types'
import ProjectsListItem from '../ProjectsListItem'
import { List } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
  paper: {
    borderRadius: 5,
    boxShadow: theme.variables.shadow1,
    backgroundColor: '#fff'
  }
}))

function ProjectsList ({
  allProjects,
  handleClick,
  onMouseEnter,
  onMouseLeave
}) {
  const classes = useStyles()
  return (
    <div className={classes.paper}>
      <List>
        {allProjects.map(project => {
          return (
            <ProjectsListItem
              project={project}
              key={project.id}
              handleClick={handleClick}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            />
          )
        })}
      </List>
    </div>
  )
}

ProjectsList.defaultProps = {
  allProjects: []
}

ProjectsList.propTypes = {
  allProjects: PropTypes.array,
  handleClick: PropTypes.func.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired
}

export default ProjectsList
