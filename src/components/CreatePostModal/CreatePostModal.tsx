import React from 'react'
import {
  UPDATE_POST
} from '../../graphql/mutations'
import ProjectSelect from '../ProjectSelect'
import { makeStyles } from '@material-ui/styles'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Grid,
  Button,
  FormControl
} from '@material-ui/core'
import FormInput from '../FormInput'
import Haikunator from 'haikunator'
import { useMutation, useApolloClient } from '@apollo/client'
import { useCreatePostMutation, useCreateProjectMutation } from './mutations'

const haikunator = new Haikunator()

const useStyles = makeStyles((theme) => ({
  content: {
    minHeight: 200
  }
}))

function CreatePostModal (props) {
  const {
    projects,
    settings,
    setSelectedProjectId,
    open,
    createPost,
    onClose
  } = props
  const classes = useStyles(props)
  const [title, setTitle] = React.useState('')

  const handleInputChange = evt => setTitle(evt.target.value)

  const onSubmit = async (evt) => {
    onClose()

    const selectedProject = await getProjectId()
    createPost.mutate({
      title: title,
      projectId: settings.dashboard.selected_project_id,
      userId: props.users.data.users[0].id
    })
  }

  const getProjectId = () => {
    if (settings.dashboard.selected_project_id) {
      return settings.dashboard.selected_project_id
    }

    return createProject()
  }

  const createProject = async () => {
    let data
    try {
      data = await props.createProject.mutate({
        name: haikunator.haikunate(),
        userId: props.users.data.users[0].id
      })
    } catch (err) {
      console.error(err)
      return
    }

    return data.data.insert_projects.returning[0].id
  }

  return (
    <Dialog
      open={open}
      fullWidth
      PaperProps={{

      }}
    >
      <DialogTitle>Create Post</DialogTitle>
      <DialogContent className={classes.content}>
        <Grid container spacing={4} alignItems='center'>
          <Grid item xs={6}>
            <FormInput
              value={title}
              onChange={handleInputChange}
              label={'Post title'}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <ProjectSelect
                selectedProjectId={settings.dashboard.selected_project_id}
                allProjects={projects?.data?.projects}
                setSelectedProjectId={setSelectedProjectId}
              />
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSubmit}>Create</Button>
      </DialogActions>
    </Dialog>
  )
}

function CreatePostModalMutations (props) {
  const createPost = useCreatePostMutation(props.posts.variables)
  const createProject = useCreateProjectMutation()

  const [updatePostMutation] = useMutation(UPDATE_POST)
  const updatePost = ({ variables }) => updatePostMutation({ variables })

  return (
    <CreatePostModal
      {...props}
      createPost={createPost}
      updatePost={updatePost}
      createProject={createProject}
    />
  )
}

export default CreatePostModalMutations
