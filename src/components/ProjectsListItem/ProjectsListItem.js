import React from 'react'
import PropTypes from 'prop-types'
import ProjectAvatar from '../ProjectsListItemAvatar'
import List from 'antd/lib/list'
import styles from './styles.scss'

function ProjectsListItem (props) {
  const { project, handleClick } = props

  const onMouseEnter = evt => {
    props.onMouseEnter(project.id)
  }

  const onMouseLeave = evt => {
    props.onMouseLeave(project.id)
  }

  return (
    <List.Item
      onClick={() => handleClick(props.project.id)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={styles.root}
    >
      <List.Item.Meta
        avatar={<ProjectAvatar id={project.id} />}
        title={<span>{project.name}</span>}
        description={<span>Posts</span>}
      />
    </List.Item>
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
