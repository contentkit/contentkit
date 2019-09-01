import React from 'react'
import PropTypes from 'prop-types'
import Select from 'antd/lib/select'

function SelectProject (props) {
  React.useEffect(() => {
    const { allProjects, selectedProject, selectProject } = props
    if (!selectedProject) {
      if (allProjects.length) {
        const [project] = allProjects
        selectProject(project.id)
      }
    }
  })

  const onChange = value => {
    props.selectProject(value)
  }

  const {
    selectedProject,
    allProjects,
    className
  } = props

  return (
    <Select
      label={'Project'}
      value={selectedProject}
      onChange={onChange}
      className={className}
    >
      {
        allProjects.map(project => <Select.Option key={project.id}>{project.name}</Select.Option>)
      }
    </Select>
  )
}

SelectProject.propTypes = {
  selectedProject: PropTypes.string,
  allProjects: PropTypes.array,
  selectProject: PropTypes.func.isRequired
}

SelectProject.defaultProps = {
  allProjects: [],
  selectedProject: null
}

export default SelectProject
