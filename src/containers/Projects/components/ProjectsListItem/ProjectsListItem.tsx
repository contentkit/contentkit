import React from 'react'
import PropTypes from 'prop-types'
import { ListItem, ListItemText, ListItemAvatar } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

import ProjectAvatar from '../ProjectsListItemAvatar'


const useStyles = makeStyles((theme: any) => ({
  root: {
    padding: theme.spacing(2)
  }
}))

type ProjectListItemProps = {
  project: { id: string, name: string },
  onClick: (id: string) => void
}

function ProjectsListItem (props) {
  const classes = useStyles(props)
  const {
    project,
    onClick
  } = props

  const handleClick = evt => {
    onClick(project.id)
  }

  return (
    <ListItem
      onClick={handleClick}
      className={classes.root}
      button
    >
      <ListItemAvatar>
        <ProjectAvatar />
      </ListItemAvatar>
      <ListItemText
        primary={project.name}
        secondary='Posts'
      />
    </ListItem>
  )
}

ProjectsListItem.propTypes = {
  project: PropTypes.object
}

ProjectsListItem.defaultProps = {
  project: {
    id: 1,
    name: ''
  }
}

export default ProjectsListItem
