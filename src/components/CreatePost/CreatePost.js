// @flow
import React from 'react'
import PropTypes from 'prop-types'
import ProjectSelect from '../ProjectSelect'
import NewProjectSnackbar from '../CreatePostSnackbar'
import FormControl from '@material-ui/core/FormControl'
import { withStyles } from '@material-ui/core/styles'
import CreatePostInput from '../CreatePostInput'
import { slugify, genProjectName } from '../../lib/util'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'

class CreatePost extends React.Component {
  static propTypes = {
    user: PropTypes.string,
    classes: PropTypes.object,
    selectedProject: PropTypes.string,
    selectProject: PropTypes.func.isRequired,
    projects: PropTypes.object,
    posts: PropTypes.object
  }

  static getDerivedStateFromProps (nextProps, nextState) {
    if (!nextProps.selectedProject) return null
    if (nextProps.selectedProject !== (nextState.project && nextState.project.id)) {
      const { allProjects } = nextProps.projects.data
      const project = allProjects.find(({ id }) => id === nextProps.selectedProject)
      return { project: project || undefined }
    }
    return null
  }

  state = {
    title: '',
    project: undefined
  }

  project = genProjectName()

  submitContent = (event) => {
    if (event.keyCode !== 13) return
    this.createNewPost()
  }

  createNewProject = () => {
    const { user, createProject: { mutate } } = this.props
    return mutate({
      name: this.project,
      userId: user
    }).then(({ data }) =>
      data.createProject
    )
  }

  createPost = async ({ project, raw, title }) => {
    const slug = slugify(title)
    const { createPost, user } = this.props
    return createPost.mutate({
      userId: user,
      projectId: project.id,
      document: {
        raw: {
          blocks: [{ text: '' }]
        },
        versions: [{
          raw: {
            blocks: [{ text: '' }]
          }
        }]
      },
      postMeta: {
        title: title,
        slug: slug,
        status: 'DRAFT',
        date: new Date().toISOString(),
        excerpt: ''
      }
    })
  }

  createNewPost = async () => {
    const raw = { blocks: [{ text: '' }] }
    let project = this.state.project || await this.createNewProject()
    let title = '' + this.state.title.slice(0)
    this.setState({ title: '' }, () => {
      this.createPost({ project, raw, title })
      this.reset()
    })
  }

  reset = () => {
    this.project = genProjectName()
  }

  handleChange = (evt) => {
    this.setState({ title: evt.target.value })
  }

  render () {
    const {
      classes,
      selectedProject,
      projects,
      selectProject,
      createPost,
      createProject
    } = this.props
    return (
      <Paper className={classes.paper} elevation={0}>
        <Grid container spacing={24} alignContent={'space-between'}>
          <Grid item xs={8}>
            <FormControl margin={'none'} fullWidth className={classes.formControl}>
              <CreatePostInput
                createPost={createPost}
                createPostMutation={this.createNewPost}
                value={this.state.title}
                handleChange={this.handleChange}
              />
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <ProjectSelect
              selectedProject={this.props.selectedProject}
              allProjects={projects.data && projects.data.allProjects}
              selectProject={selectProject}
            />
          </Grid>
        </Grid>
        <NewProjectSnackbar
          open={createProject.loading}
          newProjectName={createProject.data && createProject.data.createProject.name}
        />
      </Paper>
    )
  }
}

export const CreatePostBare = CreatePost

export const styles = () => ({
  paper: {
    padding: '20px',
    marginBottom: '1em'
  },
  button: {
    border: 'none',
    boxShadow: 'none',
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0
  },
  formControl: {
    flexGrow: 1
  }
})

export default withStyles(styles)(CreatePost)
