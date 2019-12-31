import React from 'react'
import PropTypes from 'prop-types'
import { Select, FormControl, InputLabel } from '@material-ui/core'
import { Input } from '@contentkit/components'

type SelectProjectProps = {
  selectedProject: string,
  selectProject: (value: string) => void,
  allProjects: any[],
  className: string,
  hideLabel?: boolean
}

function SelectProject (props) {
  const {
    selectedProject,
    allProjects,
    className,
    hideLabel,
    selectProject
  } = props

  React.useEffect(() => {
    const { allProjects, selectedProject, selectProject } = props
    if (!selectedProject) {
      if (allProjects.length) {
        const [project] = allProjects
        selectProject(project.id)
      }
    }
  }, [allProjects])

  const onChange = ({ currentTarget: { value } }) => {
    selectProject(value)
  }

  const input = (<Input name='project' id='project' />)
  const select = (
    <Select
      native
      labelId={'project-select'}
      value={selectedProject || ''}
      onChange={onChange}
      className={className}
      input={input}
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
  selectProject: PropTypes.func.isRequired,
  selectedProject: PropTypes.string,
  allProjects: PropTypes.array,

  hideLabel: PropTypes.bool
}

SelectProject.defaultProps = {
  allProjects: [],
  selectedProject: null,
  hideLabel: true
}

export default SelectProject
