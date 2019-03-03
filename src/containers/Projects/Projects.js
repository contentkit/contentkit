// @flow
import React from 'react'
import Layout from '../Layout'
import ProjectModal from '../../components/ProjectModal'
import Button from '@material-ui/core/Button'
import Haikunator from 'haikunator'
import ProjectsList from '../../components/ProjectsList'
import { withStyles } from '@material-ui/core/styles'

const haikunator = new Haikunator()

export const findIndex = (arr, id) => {
  let index = 0
  while (index < arr.length) {
    if (arr[index].id === id) {
      break
    }
    index++
  }
  return index >= arr.length ? -1 : index
}

class Projects extends React.Component {
  static defaultProps = {
    data: {
      allProjects: []
    },
    activeProject: undefined
  }

  state = {
    activeProject: undefined,
    open: false
  }

  handleClick = activeProject => this.setState({
    activeProject,
    open: true
  })

  handleClose = () => {
    this.setState({
      activeProject: undefined,
      open: false
    })
  }

  handleDelete = (id) => {
    this.props.deleteProject.mutate({
      id: this.state.activeProject
    })
  }

  onMouseEnter = activeProject => {
    this.setState({
      activeProject,
      open: false
    })
  }

  onMouseLeave = () => {}

  createProject = () => {
    this.props.createProject.mutate({
      name: haikunator.haikunate()
    })
  }

  render () {
    const { classes, ...rest } = this.props
    const {
      createProject,
      projects
    } = this.props
    return (
      <Layout
        loading={createProject.loading}
        history={this.props.history}
        logged={this.props.logged}
        render={() => null}
      >
        <article>
          <ProjectModal
            {...rest}
            activeProject={this.state.activeProject}
            open={this.state.open}
            handleClose={this.handleClose}
            handleDelete={this.handleDelete}
          />
          <div className={classes.container}>
            <div className={classes.inner}>
              <ProjectsList
                allProjects={projects.data && projects.data.allProjects}
                handleClick={this.handleClick}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
                handleDelete={this.handleDelete}
                handleClose={this.handleClose}
              />
            </div>
            <Button
              variant='contained'
              color='primary'
              onClick={this.createProject}
            >
              New Project
            </Button>
          </div>
        </article>
      </Layout>
    )
  }
}

const styles = theme => ({
  container: {
    width: '660px',
    margin: '2em auto'
  },
  inner: {
    margin: '2em 0'
  }
})

export default withStyles(styles)(Projects)
