import React from 'react'
import PropTypes from 'prop-types'
// import Select from '../Select'
import Select from 'antd/lib/select'

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

  onChange = value => {
    this.props.selectProject(value)
  }

  render () {
    const {
      selectedProject,
      allProjects
    } = this.props
 
    return (
      <Select
        label={'Project'}
        value={selectedProject || ''}
        onChange={this.onChange}
      >
        {
          allProjects.map(project => <Select.Option key={project.id}>{project.name}</Select.Option>)
        }
      </Select>
    )
  }
}

export default SelectProject
