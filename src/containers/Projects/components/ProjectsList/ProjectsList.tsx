import React from 'react'
import PropTypes from 'prop-types'
import ProjectsListItem from '../ProjectsListItem'
import { List } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme: any) => ({
  paper: {
    borderRadius: 0,
    boxShadow: theme.variables.shadow1,
    backgroundColor: '#fff'
  }
}))

type ProjectListProps = {
  allProjects: any[],
  onClick: (id: string) => void
}

function ProjectsList (props: ProjectListProps) {
  const {
    allProjects,
    onClick,
  } = props
  const classes = useStyles(props)
  return (
    <div className={classes.paper}>
      <List>
        {allProjects.map(project => {
          return (
            <ProjectsListItem
              project={project}
              key={project.id}
              onClick={onClick}
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
  onClick: PropTypes.func.isRequired,
}

export default ProjectsList
