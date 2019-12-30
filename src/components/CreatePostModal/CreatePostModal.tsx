import React from 'react'
import {
  CREATE_POST,
  CREATE_PROJECT,
  UPDATE_POST
} from '../../graphql/mutations'
import {
  POSTS_AGGREGATE_QUERY,
  PROJECTS_QUERY,
  USER_QUERY
} from '../../graphql/queries'
import { genKey, genDate } from '../../lib/util'
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

const haikunator = new Haikunator()

const useStyles = makeStyles((theme) => ({
  content: {
    minHeight: 200
  }
}))

function CreatePostModal (props) {
  const classes = useStyles(props)
  const [title, setTitle] = React.useState('')

  const handleInputChange = evt => setTitle(evt.target.value)

  const onSubmit = async (evt) => {
    let { handleClose, createPost } = props
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
    const { selectedProject } = props

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

  const {
    projects,
    selectProject,
    open,
    selectedProject
  } = props
  return (
    <Dialog
      open={open}
      fullWidth
      size='md'
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

function useCreatePost (postsAggregateVariables) {
  const client = useApolloClient()
  const [createPostMutation, createPostData] = useMutation(CREATE_POST)
  const mutate = (variables) => {
    const { posts_aggregate } = client.cache.readQuery({
      query: POSTS_AGGREGATE_QUERY,
      variables: postsAggregateVariables
    })
  
    createPostMutation({
      variables: variables,
      optimisticResponse: {
        __typename: 'Mutation',
        insert_posts: {
          __typename: 'posts_mutation_response',
          returning: [{
            __typename: 'Post',
            id: genKey(),
            created_at: genDate(),
            title: variables.title,
            slug: '',
            published_at: genDate(),
            excerpt: '',
            status: 'DRAFT',
            project: {
              __typename: 'Project',
              id: variables.projectId,
              name: ''
            },
            posts_tags: []
          }]
        }
      },
      update: (store, { data: { insert_posts } }) => {
        store.writeQuery({
          query: POSTS_AGGREGATE_QUERY,
          data: {
            posts_aggregate: {
              ...posts_aggregate,
              nodes: posts_aggregate.nodes.concat(insert_posts.returning)
            }
          },
          variables: postsAggregateVariables
        })
      }
    })
  }

  return {
    mutate,
    ...createPostData
  }
}

function CreatePostModalMutations (props) {
  const users = useQuery(USER_QUERY)
  const createPost = useCreatePost(props.posts.variables)

  const [updatePostMutation, updatePostData] = useMutation(UPDATE_POST)
  const [createProjectMutation, createProjectData] = useMutation(CREATE_PROJECT)

  const updatePost = ({ variables }) => updatePostMutation({ variables })

  const createProject = variables => createProjectMutation({
    variables: variables,
    optimisticResponse: {
      __typename: 'Mutation',
      insert_projects: {
        returning: [{
          __typename: 'Project',
          id: genKey(),
          name: variables.name
        }]
      }
    },
    update: (store, { data: { insert_projects } }) => {
      const projects = [...ownProps.projects.data.projects]
      projects.push(insert_projects.returning)
      store.writeQuery({
        query: PROJECTS_QUERY,
        data: { projects },
        variables: ownProps.projects.variables
      })
    }
  })

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
