import React from 'react'
import ProjectModalContent from '../ProjectModalContent'
import PropTypes from 'prop-types'
import Modal from 'antd/lib/modal'
import styles from './styles.scss'
import Button from 'antd/lib/button'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import { compose } from 'react-apollo'
import mutations from './mutations'

import {
  PROJECT_QUERY
} from '../../graphql/queries'

function ProjectModal (props) {
  const onChange = data => {
    const { client, project } = props
    return client.writeQuery({
      query: PROJECT_QUERY,
      data: {
        project: {
          ...project.data.project,
          ...data
        }
      },
      variables: project.variables
    })
  }

  const handleSave = () => {
    const { project, updateProject } = props
    handleClose()
    updateProject.mutate(project.data.project)
  }

  const handleDelete = () => {
    const { handleDelete, project: { data: { project } } } = props
    handleClose()
    handleDelete({ id: project.id })
  }

  const handleClose = () => props.handleClose()

  return (
    <Modal
      visible={props.open}
      onCancel={handleClose}
      onOk={handleSave}
      className={styles.modal}
      closable={false}
      footer={
        <Row className={styles.actions}>
          <Col span={12}>
            <Button key={'delete'} onClick={handleDelete} type={'danger'}>Delete</Button>
          </Col>
          <Col span={12}>
            <Row justify={'end'} type={'flex'}>
              <Button key={'cancel'} onClick={handleClose}>Cancel</Button>
              <Button key={'update'} onClick={handleSave} type={'primary'}>Update</Button>
            </Row>
          </Col>
        </Row>
      }
    >
      <ProjectModalContent
        onChange={onChange}
        handleSave={handleSave}
        handleDelete={handleDelete}
        handleClose={props.handleClose}
        project={props.project}
        deleteOrigin={props.deleteOrigin}
        createOrigin={props.createOrigin}
      />
    </Modal>
  )
}

ProjectModal.propTypes = {
  open: PropTypes.bool.isRequired,
  updateProject: PropTypes.object,
  handleDelete: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  client: PropTypes.object.isRequired
}

export default compose(...mutations)(ProjectModal)
