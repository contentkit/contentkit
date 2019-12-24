import React from 'react'
import PropTypes from 'prop-types'
import { Select, FormControl, InputLabel } from '@material-ui/core'
import Input from '../Input'

// type Project = {
//   id: string,
//   name: string
// }

// type SelectProjectProps = {
//   allProjects: Project[],
//   selectedProject: string,
//   selectProject: (value: string) => void
//   className: string
// }

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
    className,
    hideLabel
  } = props

  const select = (
    <Select
      native
      labelId={'project-select'}
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

  if (hideLabel) {
    return select
  }

  return (
    <FormControl fullWidth>
      <InputLabel shrink id='project-select'>
        Projects
      </InputLabel>
      {select}
    </FormControl>
  )
}

SelectProject.propTypes = {
  selectedProject: PropTypes.string,
  allProjects: PropTypes.array,
  selectProject: PropTypes.func.isRequired
}

SelectProject.defaultProps = {
  allProjects: [],
  selectedProject: null,
  hideLabel: true
}

export default SelectProject
