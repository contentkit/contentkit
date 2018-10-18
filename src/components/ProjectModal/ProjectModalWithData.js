// @flow
import React from 'react'
import { PROJECT_QUERY } from '../../graphql/queries'
import {
  DELETE_ORIGIN,
  CREATE_ORIGIN
} from '../../graphql/mutations'
import { Mutation, Query } from 'react-apollo'
import ProjectModal from './ProjectModal'
import { genKey } from '../../lib/util'

class ProjectModalMutations extends React.Component<{}, {}> {
  deleteOrigin = ({ mutate, project }) => variables => mutate({
    variables,
    optimisticResponse: {
      __typename: 'Mutation',
      deleteOrigin: {
        __typename: 'Origin',
        id: variables.id
      }
    },
    update: (store, { data: { deleteOrigin } }) => {
      const { id } = deleteOrigin
      let origins = [...project.data.project.origins]
      origins = origins.filter(origin => origin.id !== id)
      store.writeQuery({
        query: PROJECT_QUERY,
        data: {
          project: {
            ...project.data.project,
            origins
          }
        },
        variables: project.variables
      })
    }
  })

  createOrigin = ({ mutate, project }) => variables => mutate({
    variables,
    optimisticResponse: {
      __typename: 'Mutation',
      createOrigin: {
        __typename: 'Origin',
        id: genKey(),
        name: variables.name,
        project: {
          __typename: 'Project',
          id: variables.projectId
        }
      }
    },
    update: (store, { data: { createOrigin } }) => {
      let origins = [...project.data.project.origins]
      origins.push(createOrigin)
      store.writeQuery({
        query: PROJECT_QUERY,
        data: {
          ...project.data,
          project: {
            ...project.data.project,
            origins
          }
        },
        variables: project.variables
      })
    }
  })

  render () {
    if (!this.props.activeProject) {
      return false
    }
    return (
      <Query
        query={PROJECT_QUERY}
        variables={{ id: this.props.activeProject }}
      >
        {(project) => {
          if (project.loading) return false
          return (
            <Mutation mutation={CREATE_ORIGIN}>
              {(createOrigin, createOriginData) => {
                return (
                  <Mutation mutation={DELETE_ORIGIN}>
                    {(deleteOrigin, deleteOriginData) => {
                      return (
                        <ProjectModal
                          {...this.props}
                          project={project}
                          createOrigin={this.createOrigin({
                            mutate: createOrigin,
                            project
                          })}
                          deleteOrigin={this.deleteOrigin({
                            mutate: deleteOrigin,
                            project
                          })}
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

export default ProjectModalMutations
