import React from 'react'
import {
  CREATE_POST,
  CREATE_PROJECT,
  UPDATE_POST
} from '../../graphql/mutations'
import {
  FEED_QUERY,
  PROJECTS_QUERY
} from '../../graphql/queries'
import { genKey, genDate } from '../../lib/util'
import ProjectSelect from '../ProjectSelect'
import withMutation from '../../lib/withMutation'
import { compose } from 'react-apollo'
import { makeStyles } from '@material-ui/styles'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Grid,
  Button
} from '@material-ui/core'
import Input from '../Input'

const useStyles = makeStyles(theme => ({
  content: {
    minHeight: 200
  }
}))

function CreatePostModal (props) {
  const classes = useStyles(props)
  const [title, setTitle] = React.useState('')

  const handleInputChange = evt => setTitle(evt.target.value)

  const onSubmit = () => {
    const { handleClose, createPost, selectedProject } = props
    handleClose()
    createPost.mutate({
      title: title,
      projectId: selectedProject,
      userId: props.users.data.users[0].id
    })
  }

  const onCancel = () => {
    props.handleClose()
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
            <Input
              value={title}
              onChange={handleInputChange}
              //variant='outlined'
              //margin='dense'
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

const mutations = [
  withMutation({
    name: 'createPost',
    options: {
      mutation: CREATE_POST
    },
    mutate: ({ ownProps, variables }) => ({
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
          query: FEED_QUERY,
          data: {
            ...ownProps.posts.data,
            posts_aggregate: {
              ...ownProps.posts.data.posts_aggregate,
              nodes: ownProps.posts.data.posts_aggregate.nodes.concat(insert_posts.returning)
            }
          },
          variables: ownProps.posts.variables
        })
      }
    })
  }),
  withMutation({
    name: 'updatePost',
    mutate: ({ variables }) => ({ variables }),
    options: {
      mutation: UPDATE_POST
    }
  }),
  withMutation({
    name: 'createProject',
    options: {
      mutation: CREATE_PROJECT
    },
    mutate: ({ variables, ownProps }) => ({
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
  })
]

export default compose(...mutations)(CreatePostModal)
