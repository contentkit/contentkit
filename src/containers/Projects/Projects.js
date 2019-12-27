import React from 'react'
import Haikunator from 'haikunator'
import { withStyles } from '@material-ui/styles'
import { AppWrapper } from '@contentkit/components'
import ProjectModal from '../../components/ProjectModal'
import ProjectsList from '../../components/ProjectsList'
import Button from '../../components/Button'
import { useMutation, useQuery } from '@apollo/react-hooks'

import { PROJECTS_QUERY } from '../../graphql/queries'
import { UPDATE_PROJECT, CREATE_PROJECT, DELETE_PROJECT } from '../../graphql/mutations'

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
      classes,
      history,
      logged
    } = this.props
    return (
      <AppWrapper
        sidebarProps={{
          client,
          history,
          logged
        }}
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

function ProjectsMutations (props) {
  const projectsQuery = useQuery(PROJECTS_QUERY)
  const [createProjectMutation, createProjectData] = useMutation(CREATE_PROJECT)
  // const [deleteProjectMutation, deleteProjectData] = useMutation(DELETE_PROJECT)
  const [updateProjectMutation, updateProjectData] = useMutation(UPDATE_PROJECT)

  const createProject = variables => createProjectMutation({
    variables,
    optimisticResponse: {
      __typename: 'Mutation',
      insert_projects: {
        __typename: 'projects_mutation_response',
        returning: [{
          __typename: 'Project',
          ...variables,
          id: Math.floor(Math.random(1e6)),
          origins: []
        }]
      }
    },
    update: (store, { data: { insert_projects } }) => {
      store.writeQuery({
        query: PROJECTS_QUERY,
        data: {
          projects: [...projects.data.projects].concat(insert_projects.returning)
        },
        variables: projects.variables
      })
    }
  })

  const updateProject = variables => updateProjectMutation({
    variables
  })

  const deleteProject = async ({ id }) => {
    client.cache.writeQuery({
      query: PROJECTS_QUERY,
      variables: projects.variables,
      data: {
        projects: projects.data.projects.filter(project =>
          project.id !== id
        )
      }
    })
    client.mutate({
      mutation: gql`
        mutation($id: String!) {
          delete_projects(where: { id: { _eq: $id } }) {
            returning {
              id
            }
          }
        }
      `,
      variables: { id }
    })
  }

    
  if (projectsQuery.loading) {
    return false
  }

  const componentProps = {
    projects: projectsQuery,
    updateProject: {
      mutate: updateProject,
      ...updateProjectData
    },
    createProject: {
      mutate: createProject,
      ...createProjectData
    },
    deleteProject: {
      mutate: deleteProject
    }
  }
  return (
    <Projects
      {...props}
      {...componentProps}
    />
  )
}

export default withStyles(theme => ({
  container: {
    width: '660px',
    margin: '2em auto',
  },
  inner: {
    margin: '2em 0'
  }
}))(ProjectsMutations)

