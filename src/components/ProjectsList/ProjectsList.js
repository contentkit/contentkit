import React from 'react'
import PropTypes from 'prop-types'
import List from 'antd/lib/list'
import ProjectsListItem from '../ProjectsListItem'
import classes from './styles.scss'

const ProjectsList = ({
  allProjects,
  handleClick,
  onMouseEnter,
  onMouseLeave
}) => (
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

ProjectsList.defaultProps = {
  allProjects: [],
  handleClick: () => {},
  onMouseEnter: () => {},
  onMouseLeave: () => {}
}

ProjectsList.propTypes = {
}

export default ProjectsList
