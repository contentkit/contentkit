import React from 'react'
import PropTypes from 'prop-types'
import ProjectAvatar from '../ProjectsListItemAvatar'
import { ListItem, ListItemText, ListItemAvatar } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}))

function ProjectsListItem (props) {
  const classes = useStyles(props)
  const { project, handleClick } = props

  const onMouseEnter = evt => {
    props.onMouseEnter(project.id)
  }

  const onMouseLeave = evt => {
    props.onMouseLeave(project.id)
  }

  return (
    <ListItem
      onClick={() => handleClick(props.project.id)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={classes.root}
    >
      <ListItemAvatar>
        <ProjectAvatar id={project.id} />
      </ListItemAvatar>
      <ListItemText
        primary={<span>{project.name}</span>}
        secondary={<span>Posts</span>}
      />
    </ListItem>
  )
}

ProjectsListItem.propTypes = {
  onMouseEnter: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  project: PropTypes.object
}

ProjectsListItem.defaultProps = {
  project: {
    id: 1,
    name: ''
  }
}

export default ProjectsListItem
