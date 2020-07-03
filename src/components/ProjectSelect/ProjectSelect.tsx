import React from 'react'
import PropTypes from 'prop-types'
import { Select, FormControl, InputLabel, OutlinedInput } from '@material-ui/core'

type SelectProjectProps = {
  setSelectedProjectId: (value: string) => void,
  allProjects: any[],
  className?: string,
  hideLabel?: boolean,
  selectedProjectId?: string
}

function ProjectSelect (props: SelectProjectProps) {
  const {
    selectedProjectId,
    setSelectedProjectId,
    allProjects,
    className,
    hideLabel,
    ...rest
  } = props

  const onChange = ({ currentTarget: { value } }) => {
    setSelectedProjectId(value)
  }

  const select = (
    <Select
      native
      labelId='project-select'
      value={selectedProjectId || ''}
      onChange={onChange}
      className={className}
      variant='outlined'
      {...rest}
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

ProjectSelect.propTypes = {
  setSelectedProjectId: PropTypes.func.isRequired,
  selectedProject: PropTypes.string,
  allProjects: PropTypes.array,
  hideLabel: PropTypes.bool
}

ProjectSelect.defaultProps = {
  allProjects: [],
  selectedProjectId: '',
  hideLabel: true,
  setSelectedProjectId: () => {},
  input: (<OutlinedInput name='project' id='project' margin='dense' />)
}

export default ProjectSelect
