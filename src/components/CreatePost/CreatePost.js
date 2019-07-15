// @flow
import React from 'react'
import PropTypes from 'prop-types'
import ProjectSelect from '../ProjectSelect'
import NewProjectSnackbar from '../CreatePostSnackbar'
import CreatePostInput from '../CreatePostInput'
import { genProjectName } from '../../lib/util'
import classes from './styles.scss'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'

class CreatePost extends React.Component {
  static propTypes = {
    selectedProject: PropTypes.string,
    selectProject: PropTypes.func.isRequired,
    projects: PropTypes.object
  }

  static getDerivedStateFromProps (nextProps, nextState) {
    if (
      !nextProps.selectedProject || 
        nextProps.projects.loading
    ) {
      return null
    }
 
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
      projects,
      selectProject,
      selectedProject,
      createPost,
      createProject
    } = this.props
    return (
      <div className={classes.paper}>
        <Row>
          <Col sm={24} md={12}>
            <CreatePostInput
              createPost={this.createNewPost}
              value={this.state.title}
              handleChange={this.handleChange}
              loading={createPost.loading}
            />
          </Col>
          <Col sm={24} md={12} className={classes.right}>
            <ProjectSelect
              selectedProject={selectedProject}
              allProjects={projects?.data?.allProjects}
              selectProject={selectProject}
            />
          </Col>
        </Row>
        <NewProjectSnackbar
          open={createProject.loading}
          newProjectName={createProject?.data?.createProject?.name}
        />
      </div>
    )
  }
}

export const CreatePostBare = CreatePost

export default CreatePost

