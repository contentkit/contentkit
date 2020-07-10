import React from 'react'
import ProjectModalContent from '../ProjectModalContent'
import PropTypes from 'prop-types'
import { Button, Grid, Dialog, DialogContent, DialogActions, DialogTitle } from '@material-ui/core'
import { useQuery, useApolloClient } from '@apollo/client'
import {
  PROJECT_QUERY
} from '../../../../graphql/queries'
import {
  useCreateOriginMutation,
  useDeleteOriginMutation
} from '../../../../graphql/mutations'

import { makeStyles } from '@material-ui/styles'
import { GraphQL } from '../../../../types'

const useStyles = makeStyles(theme => ({
  modal: {},
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%'
  }
}))

type ProjectModalProps = {
  users: GraphQL.UserQueryResult,
  project: GraphQL.ProjectQueryResult,
  open: boolean,
  updateProject: () => void
}

function ProjectModal (props) {
  const { 
    users,
    project,
    open,
    updateProject,
    onDeleteProject,
    onSaveProject,
    onClose,
    createOrigin,
    deleteOrigin
  } = props
  const client = useApolloClient()
  const userId = users?.data?.users[0]?.id
  const projectId = project?.data?.projects[0]?.id
  const projectName = project?.data?.projects[0]?.name
  const classes = useStyles(props)

  const onChange = data => {
    return client.writeQuery({
      query: PROJECT_QUERY,
      data: {
        projects: [{
          ...project.data.projects[0],
          ...data
        }]
      },
      variables: project.variables
    })
  }

  const onSave = () => {
    onSaveProject({ name: projectName, id: projectId, userId })
  }

  if (project.loading) return null
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      className={classes.modal}
      fullWidth
      PaperProps={{

      }}
    >
      <DialogTitle>{project?.data?.projects[0]?.name}</DialogTitle>
      <DialogContent>
        <ProjectModalContent
          onChange={onChange}
          project={project}
          deleteOrigin={deleteOrigin}
          createOrigin={createOrigin}
          users={users}
        />
      </DialogContent>
      <DialogActions>
        <Grid container className={classes.actions}>
          <Grid item xs={6}>
            <Button variant='outlined' key={'delete'} onClick={onDeleteProject}>Delete</Button>
          </Grid>
          <Grid item xs={6} style={{ justifyContent: 'flex-end', display: 'flex' }}>
            <Button
              variant='outlined'
              key='cancel'
              onClick={onClose}
              style={{ marginRight: 10 }}
            >
                Cancel
            </Button>

            <Button
              variant='outlined'
              key='update'
              onClick={onSave}
              >
                Update
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  )
}

ProjectModal.propTypes = {
  open: PropTypes.bool.isRequired,
  updateProject: PropTypes.object
}


function ProjectsModalWithData (props) {
  const project = useQuery(PROJECT_QUERY, { variables: { id: props.activeProject }, skip: !props.activeProject })
  const createOrigin = useCreateOriginMutation()
  const deleteOrigin = useDeleteOriginMutation()

  return (
    <ProjectModal {...props} project={project} createOrigin={createOrigin} deleteOrigin={deleteOrigin} />
  )
}

export default ProjectsModalWithData

