import React from 'react'
import ProjectModalContent from '../ProjectModalContent'
import PropTypes from 'prop-types'
import { Grid, Dialog, DialogContent, DialogActions, DialogTitle } from '@material-ui/core'
import { useQuery, useMutation } from '@apollo/react-hooks'
import {
  PROJECT_QUERY
} from '../../graphql/queries'
import {
  CREATE_ORIGIN,
  DELETE_ORIGIN
} from '../../graphql/mutations'

import Button from '../Button'

import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
  modal: {},
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%'
  }
}))

function ProjectModal (props) {
  const classes = useStyles(props)
  const onChange = data => {
    const { client, project } = props
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

  const handleSave = () => {
    const { project, updateProject } = props
    handleClose()
    const { name, id } = project.data.projects[0]
    const userId = props.users.data.users[0].id
    updateProject.mutate({ name, id, userId })
  }

  const handleDelete = () => {
    const { handleDelete, project: { data: { projects } } } = props
    handleClose()
    const userId = props.users.data.users[0].id
    handleDelete({ id: projects[0].id, userId })
  }

  const handleClose = () => props.handleClose()
  if (props.project.loading) return null
  return (
    <Dialog
      open={props.open}
      onClose={handleClose}
      className={classes.modal}
      size='md'
      fullWidth
      PaperProps={{
        square: true
      }}
    >
      <DialogTitle>{props?.project?.data?.projects[0]?.name}</DialogTitle>
      <DialogContent>
        <ProjectModalContent
          onChange={onChange}
          handleSave={handleSave}
          handleDelete={handleDelete}
          handleClose={props.handleClose}
          project={props.project}
          deleteOrigin={props.deleteOrigin}
          createOrigin={props.createOrigin}
          users={props.users}
        />
      </DialogContent>
      <DialogActions>
        <Grid container className={classes.actions}>
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
  handleClose: PropTypes.func.isRequired
}


function ProjectsModalWithData (props) {
  const projects = useQuery(PROJECT_QUERY, { variables: { id: props.activeProject }, skip: !props.activeProject })
  const [createOriginMutation, createOriginData] = useMutation(CREATE_ORIGIN)
  const [deleteOriginMutation, deleteOriginData] = useMutation(DELETE_ORIGIN)

  const createOrigin = variables => createOriginMutation({
    optimisticResponse: {
      __typename: 'Mutation',
      insert_origins: {
        __typename: 'origins_mutation_response',
        returning: [{
          __typename: 'Origin',
          id: genKey(),
          name: variables.name,
          project: {
            __typename: 'Project',
            id: variables.projectId
          }
        }]
      }
    },
    update: (store, { data: { insert_origins } }) => {
      const query = store.readQuery({
        query: PROJECT_QUERY,
        variables: ownProps.project.variables
      })
      const { projects } = query
      const [project] = projects
      const origins = [...project.origins].concat(insert_origins.returning)
      store.writeQuery({
        query: PROJECT_QUERY,
        data: {
          projects: [{
            ...project,
            origins
          }]
        },
        variables: query.variables
      })
    }
  })

  const deleteOrigin = variables => deleteOriginMutation({
    variables,
    optimisticResponse: {
      __typename: 'Mutation',
      deleteOrigin: {
        __typename: 'Origin',
        id: variables.id
      }
    },
    update: (store, { data: { deleteOrigin } }) => {
      const { id } = deleteOrigin
      const { project } = ownProps
      const origins = [...project.data.project.origins]
        .filter(origin => origin.id !== id)
      store.writeQuery({
        query: PROJECT_QUERY,
        data: {
          project: {
            ...project.data.project,
            origins
          }
        },
        variables: project.variables
      })
    }
  })

  return (
    <ProjectModal {...props} project={projects} createOrigin={createOrigin} deleteOrigin={deleteOrigin} />
  )
}

export default ProjectsModalWithData

