import React from 'react'
import ProjectModalContent from '../ProjectModalContent'
import PropTypes from 'prop-types'
import styles from './styles.scss'
import { Grid, Dialog, DialogContent, DialogActions, DialogTitle } from '@material-ui/core'
import { compose } from 'react-apollo'
import mutations from './mutations'

import {
  PROJECT_QUERY
} from '../../graphql/queries'
import Button from '../Button'

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
  console.log(props)
  if (!props.project) return null
  return (
    <Dialog
      open={props.open}
      onClose={handleClose}
      className={styles.modal}
      size='md'
      fullWidth
    >
      <DialogTitle>{props?.project?.data?.name}</DialogTitle>
      <DialogContent>
        <ProjectModalContent
          onChange={onChange}
          handleSave={handleSave}
          handleDelete={handleDelete}
          handleClose={props.handleClose}
          project={props.project}
          deleteOrigin={props.deleteOrigin}
          createOrigin={props.createOrigin}
        />
      </DialogContent>
      <DialogActions>
        <Grid container className={styles.actions}>
          <Grid item xs={6}>
            <Button key={'delete'} onClick={handleDelete} color='danger'>Delete</Button>
          </Grid>
          <Grid item xs={6} justify='flex-end' style={{ justifyContent: 'flex-end', display: 'flex' }}>
            <Button key={'cancel'} onClick={handleClose} style={{ marginRight: 10 }}>Cancel</Button>
            <Button key={'update'} onClick={handleSave}>Update</Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
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
