import React from 'react'
import { makeStyles } from '@material-ui/styles'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Grid,
  Button,
  OutlinedInput,
  TextField
} from '@material-ui/core'
import { withRouter } from 'react-router-dom'
import Haikunator from 'haikunator'
import { useMutation } from '@apollo/client'
import { useCreatePostMutation, useCreateProjectMutation } from './mutations'
import {
  UPDATE_POST
} from '../../graphql/mutations'
import ProjectSelect from '../ProjectSelect'

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
    onClose,
    history
  } = props
  const classes = useStyles(props)
  const [title, setTitle] = React.useState('')

  const handleInputChange = evt => setTitle(evt.target.value)

  const onSubmit = async (evt) => {
    onClose()

    const data = await createPost.mutate({
      title: title,
      projectId: settings.dashboard.selected_project_id,
      userId: props.users.data.users[0].id
    })

    const { insert_posts: { returning } } = data

    history.push(`/${returning[0].id}`)
  }

  const input = (<OutlinedInput name='project' id='project' margin='dense' fullWidth />)
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
            <TextField
              value={title}
              onChange={handleInputChange}
              label={'Post title'}
              margin='dense'
              variant='outlined'
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <ProjectSelect
              onChange={setSelectedProjectId}
              input={input}
            />
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

export default withRouter(CreatePostModalMutations)
