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
  TextField,
  Button
} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
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
      projectId: selectedProject
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
    <Dialog open={open} fullWidth>
      <DialogContent className={classes.content}>
        <TextField
          value={title}
          onChange={handleInputChange}
          variant='outlined'
          margin='dense'
          label={'Post title'}

        />
        <ProjectSelect
          selectedProject={selectedProject}
          allProjects={projects?.data?.allProjects}
          selectProject={selectProject}
        />
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
        createPost: {
          __typename: 'Post',
          id: genKey(),
          createdAt: genDate(),
          title: variables.title,
          slug: '',
          publishedAt: genDate(),
          excerpt: '',
          status: 'DRAFT',
          project: {
            __typename: 'Project',
            id: variables.projectId,
            name: ''
          },
          tags: []
        }
      },
      update: (store, { data: { createPost } }) => {
        const posts = [...ownProps.feed.data.feed.posts]
        posts.unshift(createPost)
        store.writeQuery({
          query: FEED_QUERY,
          data: {
            ...ownProps.feed.data,
            feed: {
              ...ownProps.feed.data.feed,
              posts: posts
            }
          },
          variables: ownProps.feed.variables
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
        createProject: {
          __typename: 'Project',
          id: genKey(),
          name: variables.name
        }
      },
      update: (store, { data: { createProject } }) => {
        const allProjects = [...ownProps.projects.data.allProjects]
        allProjects.push(createProject)
        store.writeQuery({
          query: PROJECTS_QUERY,
          data: { allProjects },
          variables: ownProps.projects.variables
        })
      }
    })
  })
]

export default compose(...mutations)(CreatePostModal)
