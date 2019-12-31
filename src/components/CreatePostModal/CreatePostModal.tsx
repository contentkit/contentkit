import React from 'react'
import {
  CREATE_POST,
  CREATE_PROJECT,
  UPDATE_POST
} from '../../graphql/mutations'
import { USER_QUERY } from '../../graphql/queries'
import ProjectSelect from '../ProjectSelect'
import { makeStyles } from '@material-ui/styles'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Grid,
  Button
} from '@material-ui/core'
import FormInput from '../FormInput'
import Haikunator from 'haikunator'
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks'
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
    selectProject,
    open,
    createPost,
    handleClose,
    selectedProject
  } = props
  const classes = useStyles(props)
  const [title, setTitle] = React.useState('')

  const handleInputChange = evt => setTitle(evt.target.value)

  const onSubmit = async (evt) => {
    handleClose()

    const selectedProject = await getProjectId()
    createPost.mutate({
      title: title,
      projectId: selectedProject,
      userId: props.users.data.users[0].id
    })
  }

  const onCancel = () => {
    props.handleClose()
  }

  const getProjectId = () => {
    if (selectedProject) {
      return selectedProject
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
        square: true
      }}
    >
      <DialogTitle>Create Post</DialogTitle>
      <DialogContent className={classes.content}>
        <Grid container spacing={4}>
          <Grid item xs={6}>
            <FormInput
              value={title}
              onChange={handleInputChange}
              label={'Post title'}
            />
          </Grid>
          <Grid item xs={6}>
            <ProjectSelect
              selectedProject={selectedProject}
              allProjects={projects?.data?.projects}
              selectProject={selectProject}
              hideLabel={false}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onSubmit}>Create</Button>
      </DialogActions>
    </Dialog>
  )
}

function CreatePostModalMutations (props) {
  const users = useQuery(USER_QUERY)
  const createPost = useCreatePostMutation(props.posts.variables)
  const createProject = useCreateProjectMutation()

  const [updatePostMutation, updatePostData] = useMutation(UPDATE_POST)
  const updatePost = ({ variables }) => updatePostMutation({ variables })

  return (
    <CreatePostModal
      {...props}
      users={users}
      createPost={createPost}
      updatePost={updatePost}
      createProject={createProject}
    />
  )
}

export default CreatePostModalMutations
