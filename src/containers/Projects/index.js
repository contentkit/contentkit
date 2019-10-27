// @flow
import React from 'react'
import { PROJECTS_QUERY } from '../../graphql/queries'
import { UPDATE_PROJECT, CREATE_PROJECT } from '../../graphql/mutations'

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

class ProjectsMutations extends React.Component {
  createProject = ({ mutate, projects }) => variables => mutate({
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

  updateProject = ({ mutate }) => variables => mutate({
    variables
  })

  deleteProject = ({ projects }) => async ({ id }) => {
    this.props.client.cache.writeQuery({
      query: PROJECTS_QUERY,
      variables: projects.variables,
      data: {
        projects: projects.data.projects.filter(project =>
          project.id !== id
        )
      }
    })
    this.props.client.mutate({
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

  render () {
    const { users } = this.props
    return (
      <Query query={PROJECTS_QUERY}>
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
                            mutate: this.updateProject({
                              mutate: updateProject
                            }),
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

export default withRouter(ProjectsMutations)
