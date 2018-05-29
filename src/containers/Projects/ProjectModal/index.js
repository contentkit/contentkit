import React from 'react'
import {
  PROJECT_QUERY,
  PROJECTS_QUERY,
  CREATE_DOMAIN,
  DELETE_DOMAIN,
  styles
} from './mutations'
import { Mutation, Query } from 'react-apollo'
import { withStyles } from '@material-ui/core/styles'
import ProjectModal from './ProjectModal'
import { genKey } from '../../../lib/util'

class ProjectModalMutations extends React.Component {
  deleteDomain = ({ mutate, project }) => variables => mutate({
    variables,
    optimisticResponse: {
      __typename: 'Mutation',
      deleteDomain: {
        __typename: 'Domain',
        id: variables.id
      }
    },
    update: (store, { data: { deleteDomain } }) => {
      const { id } = deleteDomain
      const { data: { Project } } = project
      let domains = [...Project.domains]
      domains = domains.filter(domain => domain.id !== id)
      store.writeQuery({
        query: PROJECT_QUERY,
        data: { Project: { ...Project, domains } },
        variables: { id: Project.id }
      })
    }
  })

  createDomain = ({ mutate, project }) => variables => mutate({
    variables,
    optimisticResponse: {
      __typename: 'Mutation',
      createDomain: {
        __typename: 'Domain',
        id: genKey(),
        name: variables.name,
        project: {
          __typename: 'Project',
          id: variables.projectId
        }
      }
    },
    update: (store, { data: { createDomain } }) => {
      const { data: { Project } } = project
      let domains = [...Project.domains]
      domains.push(createDomain)
      store.writeQuery({
        query: PROJECT_QUERY,
        data: {
          ...project.data,
          Project: {
            ...Project,
            domains
          }
        },
        variables: { id: Project.id }
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
            <Mutation mutation={CREATE_DOMAIN}>
              {(createDomain, createDomainData) => {
                return (
                  <Mutation mutation={DELETE_DOMAIN}>
                    {(deleteDomain, deleteDomainData) => {
                      return (
                        <ProjectModal
                          {...this.props}
                          project={project}
                          createDomain={this.createDomain({
                            mutate: createDomain,
                            project
                          })}
                          deleteDomain={this.deleteDomain({
                            mutate: deleteDomain,
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

export default withStyles(styles)(ProjectModalMutations)
