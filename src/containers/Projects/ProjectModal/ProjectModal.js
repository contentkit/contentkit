// @flow
import React from 'react'
import Modal from '@material-ui/core/Modal'
import {
  PROJECT_QUERY
} from './mutations'
import ProjectModalContent from './ProjectModalContent'
import PropTypes from 'prop-types'
import type { project, Domain } from '../../../types'

type Props = {
  updateProject: {
    mutate: (project) => void
  },
  client: any,
  handleDelete: ({ id: string }) => void,
  handleClose: () => void,
  deleteDomain: () => void,
  createDomain: ({ projectId: string, name: string }) => void,
  project: {
    variables: {},
    data: {
      Project: project
    }
  },
  classes: {
    wrapper: string
  }
}

type State = {}

class ProjectModal extends React.Component<Props, State> {
  //state = {
  //  project: this.props.project
  //}

  static propTypes = {
    updateProject: PropTypes.object,
    handleDelete: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired
  }

  _onChange = data => this.props.client.writeQuery({
    query: PROJECT_QUERY,
    data: {
      Project: {
        ...this.props.project.data.Project,
        ...data
      }
    },
    variables: { id: this.props.project.variables }
  })

  handleSave = () => {
    this.props.updateProject.mutate(this.props.project.data.Project)
    this.props.handleClose()
  }

  handleDelete = () => {
    const { id } = this.props.project.data.Project
    this.props.handleDelete({ id })
    this.props.handleClose()
  }

  render () {
    return (
      <Modal
        open={this.props.open}
        onClose={this.props.handleClose}
        className={this.props.classes.modal}
      >
        <div className={this.props.classes.wrapper}>
          <ProjectModalContent
            onChange={this._onChange}
            handleSave={this.handleSave}
            handleDelete={this.handleDelete}
            handleClose={this.props.handleClose}
            project={this.props.project}
            deleteDomain={this.props.deleteDomain}
            createDomain={this.props.createDomain}
          />
        </div>
      </Modal>
    )
  }
}

export default ProjectModal
