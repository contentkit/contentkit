import React from 'react'
import PropTypes from 'prop-types'
import { Typography, Avatar, Divider, ListItem, ListItemText, ListItemAvatar, Divider } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import formatDistanceToNow from 'date-fns/esm/formatDistanceToNow'
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

  const createdAt = React.useMemo(() => {
    return formatDistanceToNow(new Date(project.created_at))
  }, [project.created_at])
  return (
    <>
      <ListItem
        onClick={handleClick}
        className={classes.root}
        button
      >
        <ListItemAvatar>
          <Avatar />
        </ListItemAvatar>
        <ListItemText
          primary={project.name}
          secondary={createdAt}
        />
        {/* <Typography>
          Created {createdAt}
        </Typography> */}
      </ListItem>
      <Divider />
    </>
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
