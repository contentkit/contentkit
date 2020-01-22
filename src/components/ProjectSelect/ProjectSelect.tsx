import React from 'react'
import PropTypes from 'prop-types'
import { Select, FormControl, InputLabel } from '@material-ui/core'
import { Input } from '@contentkit/components'

type SelectProjectProps = {
  selectedProjectId: string,
  setSelectedProjectId: (value: string) => void,
  allProjects: any[],
  className: string,
  hideLabel?: boolean
}

function SelectProject (props) {
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

  const input = (<Input name='project' id='project' />)
  const select = (
    <Select
      native
      labelId={'project-select'}
      value={selectedProjectId || ''}
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
