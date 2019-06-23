import React from 'react'
import {
  PROJECT_QUERY
} from '../../graphql/queries'
import ProjectModalContent from '../ProjectModalContent'
import PropTypes from 'prop-types'
import Modal from 'antd/lib/modal'
import styles from './styles.scss'
import Button from 'antd/lib/button'

class ProjectModal extends React.Component {
  static propTypes = {
    updateProject: PropTypes.object,
    handleDelete: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired
  }

  onChange = data => {
    console.log({ data })
    return this.props.client.writeQuery({
      query: PROJECT_QUERY,
      data: {
        project: {
          ...this.props.project.data.project,
          ...data
        }
      },
      variables: { id: this.props.project.variables }
    })
  }

  handleSave = () => {
    this.handleClose()
    this.props.updateProject.mutate(this.props.project.data.project)
  }

  handleDelete = () => {
    this.handleClose()
    const { id } = this.props.project.data.project
    this.props.handleDelete({ id })
  }

  handleClose = () => this.props.handleClose()

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
        footer={[
          <Button onClick={this.handleDelete} type={'danger'}>Delete</Button>,
          <Button onClick={handleClose}>Cancel</Button>,
          <Button onClick={this.handleSave} type={'primary'}>Update</Button>
        ]}
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
