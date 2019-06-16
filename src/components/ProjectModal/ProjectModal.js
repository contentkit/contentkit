import React from 'react'
import {
  PROJECT_QUERY
} from '../../graphql/queries'
import ProjectModalContent from '../ProjectModalContent'
import PropTypes from 'prop-types'
import Modal from 'antd/lib/modal'
import styles from './styles.scss'

class ProjectModal extends React.Component {
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
    this.props.handleClose()
    this.props.updateProject.mutate(this.props.project.data.project)
  }

  handleDelete = () => {
    this.props.handleClose()
    const { id } = this.props.project.data.project
    this.props.handleDelete({ id })
  }

  render () {
    const {
      handleClose,
    } = this.props
    return (
      <Modal
        visible={this.props.open}
        onCancel={handleClose}
        onOk={this.handleSave}
        className={styles.modal}
        closable={false}
      >
        <ProjectModalContent
          onChange={this.onChange}
          handleSave={this.handleSave}
          handleDelete={this.handleDelete}
          handleClose={this.props.handleClose}
          project={this.props.project}
          deleteOrigin={this.props.deleteOrigin}
          createOrigin={this.props.createOrigin}
        />
      </Modal>
    )
  }
}

export default ProjectModal
