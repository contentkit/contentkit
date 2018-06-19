// @flow
import React from 'react'
import PropTypes from 'prop-types'
import Select from '../Select'

class SelectProject extends React.Component<{
  allProjects: Array<{id: string, name: string}>,
  selectedProject: string,
  selectProject: () => void
}> {
  static propTypes = {
    allProjects: PropTypes.array,
    selectedProject: PropTypes.string,
    selectProject: PropTypes.func.isRequired
  }

  onChange = ({ target }) => {
    this.props.selectProject(target.value)
  }

  render () {
    const {
      selectedProject,
      allProjects
    } = this.props
    const options = allProjects.map(project => ({
      value: project.id,
      label: project.name
    }))
    return (
      <Select
        options={options}
        label={'Project'}
        value={selectedProject || ''}
        onChange={this.onChange}
      />
    )
  }
}

export default SelectProject
