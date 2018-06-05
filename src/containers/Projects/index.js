// @flow
import React from 'react'
import { PROJECTS_QUERY, UPDATE_PROJECT, CREATE_PROJECT } from './mutations'
import { Query, Mutation } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import Projects from './Projects'

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

class ProjectsMutations extends React.Component<{}, {}> {
  createProject = ({ mutate, projects }) => variables => mutate({
    variables,
    optimisticResponse: {
      __typename: 'Mutation',
      createProject: {
        __typename: 'Project',
        ...variables,
        id: Math.floor(Math.random(1e6)),
        domains: []
      }
    },
    update: (store, { data: { createProject } }) => {
      const allProjects = [...projects.data.allProjects]
      allProjects.push(createProject)
      store.writeQuery({
        query: PROJECTS_QUERY,
        data: {
          allProjects
        },
        variables: projects.variables
      })
    }
  })

  updateProject = ({ mutate }) => variables => mutate({
    variables
  })

  deleteProject = ({ projects }) => async ({ id }) => {
    const { client } = this.props
    const project = projects.data.allProjects.find(project => project.id === id)
    const { domains } = project
    client.cache.writeQuery({
      query: PROJECTS_QUERY,
      variables: projects.variables,
      data: {
        allProjects: projects.data.allProjects.filter(project => project.id !== id)
      }
    })
    if (domains.length) {
      await Promise.all(
        domains.map(domain => client.mutate({
          mutation: gql`
            mutation($id: ID!) {
              deleteDomain(id: $id) {
                id
              }
            }
          `,
          variables: { id: domain.id }
        }))
      )
    }
    client.mutate({
      mutation: gql`
        mutation($id: ID!) {
          deleteProject(id: $id) {
            id
          }
        }
      `,
      variables: { id }
    })
  }

  render () {
    const { auth } = this.props
    return (
      <Query query={PROJECTS_QUERY} variables={{ id: auth.user.id }}>
        {(projects) => {
          const { data, loading } = projects
          if (loading) return false
          return (
            <Mutation mutation={UPDATE_PROJECT}>
              {(updateProject, updateProjectData) => {
                return (
                  <Mutation mutation={CREATE_PROJECT}>
                    {(createProject, createProjectData) => {
                      return (
                        <Projects
                          data={data}
                          projects={projects}
                          updateProject={{
                            mutate: this.updateProject({ mutate: updateProject }),
                            ...updateProjectData
                          }}
                          deleteProject={{
                            mutate: this.deleteProject({
                              projects
                            })
                          }}
                          createProject={{
                            ...createProjectData,
                            mutate: this.createProject({
                              mutate: createProject,
                              projects
                            })
                          }}
                          {...this.props}
                        />

                      )
                    }}
                  </Mutation>
                )
              }}
            </Mutation>
          )
        }}
      </Query>
    )
  }
}

export default withRouter(props => props.auth && props.auth.user
  ? <ProjectsMutations {...props} />
  : <div />)
