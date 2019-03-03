// @flow
import React from 'react'
import PropTypes from 'prop-types'
import ProjectSelect from '../ProjectSelect'
import NewProjectSnackbar from '../CreatePostSnackbar'
import FormControl from '@material-ui/core/FormControl'
import { withStyles } from '@material-ui/core/styles'
import CreatePostInput from '../CreatePostInput'
import { genProjectName } from '../../lib/util'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'

class CreatePost extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    selectedProject: PropTypes.string,
    selectProject: PropTypes.func.isRequired,
    projects: PropTypes.object
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
    const { createProject: { mutate } } = this.props
    return mutate({
      name: this.project
    }).then(({ data }) =>
      data.createProject
    )
  }

  createPost = async ({ project, title }) => {
    return this.props.createPost.mutate({
      projectId: project.id,
      title
    })
  }

  createNewPost = async () => {
    let project = this.state.project || await this.createNewProject()
    let title = '' + this.state.title.slice(0)
    this.setState({ title: '' }, () => {
      this.createPost({ project, title })
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
      projects,
      selectProject,
      selectedProject,
      createPost,
      createProject
    } = this.props
    return (
      <Paper className={classes.paper} elevation={0}>
        <Grid container spacing={24} alignContent={'space-between'}>
          <Grid item xs={8}>
            <FormControl margin={'none'} fullWidth className={classes.formControl}>
              <CreatePostInput
                createPost={this.createNewPost}
                value={this.state.title}
                handleChange={this.handleChange}
                loading={createPost.loading}
              />
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <ProjectSelect
              selectedProject={selectedProject}
              allProjects={projects?.data?.allProjects}
              selectProject={selectProject}
            />
          </Grid>
        </Grid>
        <NewProjectSnackbar
          open={createProject.loading}
          newProjectName={createProject?.data?.createProject?.name}
        />
      </Paper>
    )
  }
}

export const CreatePostBare = CreatePost

export const styles = () => ({
  paper: {
    padding: '20px',
    marginBottom: '40px',
    boxShadow: 'rgba(8, 35, 51, 0.03) 0px 0px 2px, rgba(8, 35, 51, 0.05) 0px 3px 6px'
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
