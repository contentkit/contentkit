import React from 'react'
import PropTypes from 'prop-types'
import ProjectAvatar from '../ProjectsListItemAvatar'
import List from 'antd/lib/list'
import styles from './styles.scss'

function ProjectsListItem (props) {
  const onMouseEnter = evt => {
    props.onMouseEnter(props.project.id)
  }

  const onMouseLeave = evt => {
    props.onMouseLeave(props.project.id)
  }

  return (
    <List.Item
      onClick={() => props.handleClick(props.project.id)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={styles.root}
    >
      <List.Item.Meta
        avatar={<ProjectAvatar id={props.project.id} />}
        title={<span>{props.project.name}</span>}
        description={<span>Posts</span>}
      />
    </List.Item>
  )
}

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
