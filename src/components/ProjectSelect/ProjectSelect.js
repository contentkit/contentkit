import React from 'react'
import PropTypes from 'prop-types'
import Select from '../Select'

class SelectProject extends React.Component {
  static propTypes = {
    allProjects: PropTypes.array,
    selectedProject: PropTypes.string,
    selectProject: PropTypes.func.isRequired
  }

  static defaultProps = {
    allProjects: []
  }

  componentDidUpdate (prevProps) {
    const { allProjects } = this.props
    if (!prevProps.allProjects.length && allProjects.length) {
      this.props.selectProject(allProjects[0].id)
    }
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
