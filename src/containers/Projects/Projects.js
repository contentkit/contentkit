import React from 'react'
import ProjectModal from '../../components/ProjectModal'
import Haikunator from 'haikunator'
import ProjectsList from '../../components/ProjectsList'
import Button from '../../components/Button'
import { withStyles } from '@material-ui/styles'
import { AppWrapper } from '@contentkit/components'

const haikunator = new Haikunator()

class Projects extends React.Component {
  static defaultProps = {}

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
      activeProject: null,
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
      name: haikunator.haikunate(),
      userId: this.props.users.data.users[0].id
    })
  }

  render () {
    const { ...rest } = this.props
    const {
      client,
      createProject,
      projects,
      classes
    } = this.props
    return (
      <AppWrapper
        client={client}
        loading={createProject.loading}
        history={this.props.history}
        logged={this.props.logged}
      >
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
              allProjects={projects?.data?.projects}
              handleClick={this.handleClick}
              onMouseEnter={this.onMouseEnter}
              onMouseLeave={this.onMouseLeave}
              handleDelete={this.handleDelete}
              handleClose={this.handleClose}
            />
          </div>
          <Button
            onClick={this.createProject}
          >
            New Project
          </Button>
        </div>
      </AppWrapper>
    )
  }
}

export default withStyles(theme => ({
  container: {
    width: '660px',
    margin: '2em auto',
  },
  inner: {
    margin: '2em 0'
  }
}))(Projects)

