import React from 'react'
import PropTypes from 'prop-types'
import List from 'antd/lib/list'
import ProjectsListItem from '../ProjectsListItem'
import classes from './styles.scss'

function ProjectsList ({
  allProjects,
  handleClick,
  onMouseEnter,
  onMouseLeave
}) {
  return (
    <div className={classes.paper}>
      <List
        dataSource={allProjects}
        itemLayout='horizontal'
        renderItem={project => (
          <ProjectsListItem
            project={project}
            key={project.id}
            handleClick={handleClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
        )}
      />
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
