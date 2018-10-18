// @flow
import React from 'react'
import Modal from '@material-ui/core/Modal'
import {
  PROJECT_QUERY
} from '../../graphql/queries'
import ProjectModalContent from '../ProjectModalContent'
import PropTypes from 'prop-types'
import type { Project } from '../../types'
import { withStyles } from '@material-ui/core/styles'
import { styles } from './styles'

type Props = {
  updateProject: {
    mutate: (Project) => void
  },
  client: any,
  handleDelete: ({ id: string }) => void,
  handleClose: () => void,
  deleteOrigin: () => void,
  createOrigin: ({ projectId: string, name: string }) => void,
  project: {
    variables: {},
    data: {
      Project: Project
    }
  },
  classes: {
    wrapper: string
  }
}

type State = {}

class ProjectModal extends React.Component<Props, State> {
  // state = {
  //  project: this.props.project
  // }

  static propTypes = {
    updateProject: PropTypes.object,
    handleDelete: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired
  }

  onChange = data => this.props.client.writeQuery({
    query: PROJECT_QUERY,
    data: {
      Project: {
        ...this.props.project.data.project,
        ...data
      }
    },
    variables: { id: this.props.project.variables }
  })

  handleSave = () => {
    this.props.updateProject.mutate(this.props.project.data.project)
    this.props.handleClose()
  }

  handleDelete = () => {
    const { id } = this.props.project.data.project
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
            onChange={this.onChange}
            handleSave={this.handleSave}
            handleDelete={this.handleDelete}
            handleClose={this.props.handleClose}
            project={this.props.project}
            deleteOrigin={this.props.deleteOrigin}
            createOrigin={this.props.createOrigin}
          />
        </div>
      </Modal>
    )
  }
}

export default withStyles(styles)(ProjectModal)
