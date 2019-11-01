import React from 'react'
import PropTypes from 'prop-types'
import { Select } from '@material-ui/core'
import Input from '../Input'

function SelectProject (props) {
  React.useEffect(() => {
    const { allProjects, selectedProject, selectProject } = props
    if (!selectedProject) {
      if (allProjects.length) {
        const [project] = allProjects
        selectProject(project.id)
      }
    }
  }, [props.allProjects])

  const onChange = ({ currentTarget: { value } }) => {
    props.selectProject(value)
  }

  const {
    selectedProject,
    allProjects,
    className
  } = props

  return (
    <Select
      native
      label={'Project'}
      value={selectedProject}
      onChange={onChange}
      className={className}
      input={<Input name='project' id='project' />}
    >
      {
        allProjects.map(project => <option key={project.id} value={project.id}>{project.name}</option>)
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
