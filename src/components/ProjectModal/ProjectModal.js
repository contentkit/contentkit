import React from 'react'
import ProjectModalContent from '../ProjectModalContent'
import PropTypes from 'prop-types'
import Modal from 'antd/lib/modal'
import styles from './styles.scss'
import Button from 'antd/lib/button'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'

import {
  PROJECT_QUERY
} from '../../graphql/queries'

class ProjectModal extends React.Component {
  static propTypes = {
    updateProject: PropTypes.object,
    handleDelete: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired
  }

  onChange = data => {
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
        footer={
          <Row className={styles.actions}>
            <Col span={12}>
              <Button key={'delete'} onClick={this.handleDelete} type={'danger'}>Delete</Button>
            </Col>
            <Col span={12}>
              <Row justify={'end'} type={'flex'}>
                <Button key={'cancel'} onClick={handleClose}>Cancel</Button>
                <Button key={'update'} onClick={this.handleSave} type={'primary'}>Update</Button>
              </Row>
            </Col>
          </Row>
        }
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
