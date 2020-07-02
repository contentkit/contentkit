import React from 'react'
import PropTypes from 'prop-types'
import { InputBase, Select, FormControl, InputLabel } from '@material-ui/core'

type SelectProjectProps = {
  selectedProjectId: string,
  setSelectedProjectId: (value: string) => void,
  allProjects: any[],
  className: string,
  hideLabel?: boolean
}

function SelectProject (props: SelectProjectProps) {
  const {
    selectedProjectId,
    setSelectedProjectId,
    allProjects,
    className,
    hideLabel
  } = props

  const onChange = ({ currentTarget: { value } }) => {
    setSelectedProjectId(value)
  }

  const input = (<InputBase name='project' id='project' />)
  const select = (
    <Select
      native
      labelId='project-select'
      value={selectedProjectId || ''}
      onChange={onChange}
      className={className}
      input={input}
      variant='outlined'
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
  setSelectedProjectId: PropTypes.func.isRequired,
  selectedProject: PropTypes.string,
  allProjects: PropTypes.array,

  hideLabel: PropTypes.bool
}

SelectProject.defaultProps = {
  allProjects: [],
  selectedProjectId: '',
  hideLabel: true,
  setSelectedProjectId: () => {}
}

export default SelectProject
