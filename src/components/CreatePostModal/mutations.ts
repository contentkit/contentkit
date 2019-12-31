import {
  CREATE_POST,
  CREATE_PROJECT,
  UPDATE_POST
} from '../../graphql/mutations'
import { POSTS_AGGREGATE_QUERY, PROJECTS_QUERY } from '../../graphql/queries'
import { genKey, genDate } from '../../lib/util'

import { useApolloClient, useMutation } from '@apollo/react-hooks'

export function useCreatePostMutation (postsAggregateVariables) {
  const client = useApolloClient()
  const [createPostMutation, createPostData] = useMutation(CREATE_POST)
  const mutate = (variables) => {
    const { posts_aggregate } = client.cache.readQuery({
      query: POSTS_AGGREGATE_QUERY,
      variables: postsAggregateVariables
    })
  
    createPostMutation({
      variables: variables,
      optimisticResponse: {
        __typename: 'Mutation',
        insert_posts: {
          __typename: 'posts_mutation_response',
          returning: [{
            __typename: 'Post',
            id: genKey(),
            created_at: genDate(),
            title: variables.title,
            slug: '',
            published_at: genDate(),
            excerpt: '',
            status: 'DRAFT',
            project: {
              __typename: 'Project',
              id: variables.projectId,
              name: ''
            },
            posts_tags: []
          }]
        }
      },
      update: (store, { data: { insert_posts } }) => {
        store.writeQuery({
          query: POSTS_AGGREGATE_QUERY,
          data: {
            posts_aggregate: {
              ...posts_aggregate,
              nodes: posts_aggregate.nodes.concat(insert_posts.returning)
            }
          },
          variables: postsAggregateVariables
        })
      }
    })
  }

  return {
    mutate,
    ...createPostData
  }
}

export function useCreateProjectMutation () {
  const client = useApolloClient()
  const [createProjectMutation, createProjectData] = useMutation(CREATE_PROJECT)
  const createProject = variables => {
    const { projects } = client.cache.readQuery({
      query: PROJECTS_QUERY,
      variables: {}
    })
    return createProjectMutation({
      variables: variables,
      optimisticResponse: {
        __typename: 'Mutation',
        insert_projects: {
          returning: [{
            __typename: 'Project',
            id: genKey(),
            name: variables.name
          }]
        }
      },
      update: (store, { data: { insert_projects } }) => {
        store.writeQuery({
          query: PROJECTS_QUERY,
          data: {
            projects: projects.concat([insert_projects.returning])
          },
          variables: {}
        })
      }
    })
  }
  return createProject
}
