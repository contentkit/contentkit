import gql from 'graphql-tag'
import { POST_QUERY, USER_QUERY, PROJECTS_QUERY, PROJECT_QUERY, TAG_QUERY, SETTINGS_QUERY } from '../queries'
import { useMutation, useApolloClient } from '@apollo/client'
import { genKey, genDate } from '../../lib/util'
import ApolloClient from '@apollo/client'
import { GraphQL } from '../../types'
import { Typename } from '../constants'
import * as Mutations from './graphql'

export * from './graphql'

export function useCreateImage () {
  const [createImageMutation] = useMutation(Mutations.CREATE_IMAGE)
  const createImage = variables => createImageMutation({
    variables,
    optimisticResponse: {
      __typename: Typename.MUTATION,
      insert_images: {
        __typename: Typename.IMAGES_MUTATION_RESPONSE,
        returning: [{
          __typename: Typename.IMAGE,
          id: variables.url,
          ...variables
        }]
      }
    },
    update: (store, { data: { insert_images } }) => {
      const { posts } = store.readQuery({
        query: POST_QUERY,
        variables: { id: variables.postId }
      })
      store.writeQuery({
        query: POST_QUERY,
        data: {
          posts: [{
            ...posts[0],
            images: [...posts[0].images].concat(insert_images.returning)
          }]
        },
        variables: posts.variables
      })
    }
  })

  return createImage
}

export function useDeleteImage () {
  const [deleteImageMutation] = useMutation(Mutations.DELETE_IMAGE)
  const deleteImage = variables => deleteImageMutation({
    variables,
    optimisticResponse: {
      __typename: Typename.MUTATION,
      delete_images: {
        __typename: Typename.IMAGES_MUTATION_RESPONSE,
        response: [{
          __typename: Typename.IMAGE,
          ...variables
        }]
      }
    },
    update: (store, { data: { delete_images } }) => {
      const { posts } = store.readQuery({
        query: POST_QUERY,
        variables: { id: variables.postId }
      })
      store.writeQuery({
        query: POST_QUERY,
        data: {
          posts: [{
            ...posts[0],
            images: posts[0].images.filter(img => img.id !== variables.id)
          }]
        },
        variables: posts.variables
      })
    }
  })

  return deleteImage
}

type UpdateDocumentMutationVariables = {
  id: string,
  raw: any,
  encodedHtml: string
}

export function getUpdateDocumentMutationOptions (client: ApolloClient<any>, variables: GraphQL.UpdateDocumentMutationVariables) {
  const { posts } : { posts: any[] } = client.cache.readQuery({
    query: POST_QUERY,
    variables: { id: variables.id }
  })
  return {
    mutation: Mutations.UPDATE_DOCUMENT,
    variables,
    optimisticResponse: {
      __typename: Typename.MUTATION,
      update_posts: {
        __typename: Typename.POSTS_MUTATION_RESPONSE,
        returning: [{
          __typename: Typename.POST,
          ...posts[0],
          ...variables
        }]
      }
    },
    update: (store, { data: { update_posts } }) => {
      const data = {
        query: POST_QUERY,
        variables: { id: variables.id },
        data: {
          posts: [{
            ...posts[0],
            ...update_posts.returning[0]
          }]
        }
      }
      store.writeQuery(data)
    }
  }
}

export function useUpdateDocument () {
  const client = useApolloClient()
  const [updateDocumentMutation, data] = useMutation(Mutations.UPDATE_DOCUMENT)
  const mutate = variables => { 
    const options = getUpdateDocumentMutationOptions(client, variables)
    return updateDocumentMutation(options)
  }

  return {
    mutate,
    ...data
  }
}

export function useGenerateToken () {
  const client = useApolloClient()
  const [generateTokenMutation, data] = useMutation(Mutations.GENERATE_TOKEN)
  const mutate = variables => {
    const { users } = client.cache.readQuery({
      query: USER_QUERY
    })
  
    return generateTokenMutation({
      variables,
      optimisticResponse: {
        __typename: Typename.MUTATION,
        generateToken: {
          __typename: Typename.USER,
          ...users[0],
          secret: 'pending...'
        }
      },
      update: (store, { data: { generateToken } }) => {
        const user = {
          ...users[0],
          ...generateToken
        }

        store.writeQuery({
          query: USER_QUERY,
          data: { user }
        })
      }
    })
  }

  return {
    mutate,
    ...data
  }
}

export function useUpdateUser () {
  const [updateUserMutation, updateUserData] = useMutation(Mutations.UPDATE_USER)
  const mutate = (variables) => {
    return updateUserMutation({ variables })
  }

  return {
    mutate,
    ...updateUserData
  }
}


export function useDeleteUser () {
  const client = useApolloClient()
  const [updateUserMutation, data] = useMutation(Mutations.UPDATE_USER)
  const mutate = async (variables) => {
    let data
    try {
      data = await updateUserMutation({ variables })
    } catch(err) {
      console.error(err)
      throw err
    }

    window.localStorage.removeItem('token')
    client.resetStore()
    return data
  }

  return {
    mutate,
    ...data
  }
}


export function useCreateProjectMutation () {
  const [mutate, data] = useMutation(Mutations.CREATE_PROJECT)

  const createProject = variables => mutate({
    variables,
    optimisticResponse: {
      __typename: Typename.MUTATION,
      insert_projects: {
        __typename: Typename.PROJECTS_MUTATION_RESPONSE,
        returning: [{
          __typename: Typename.PROJECT,
          ...variables,
          id: Math.floor(Math.random(1e6)),
          origins: []
        }]
      }
    },
    update: (store, { data: { insert_projects } }) => {
      const { projects } = store.readQuery({
        query: PROJECTS_QUERY
      })
      store.writeQuery({
        query: PROJECTS_QUERY,
        data: {
          projects: [...projects].concat(insert_projects.returning)
        },
        variables: projects.variables
      })
    }
  })

  return {
    mutate: createProject,
    ...data
  }
}

export function useDeleteProjectMutation () {
  const client = useApolloClient()

  const deleteProject = async ({ id }) => {
    const query : { variables: any, projects: any[] }= client.cache.readQuery({
      query: PROJECTS_QUERY,
      variables: { id }
    })
    client.cache.writeQuery({
      query: PROJECTS_QUERY,
      variables: query.variables,
      data: {
        projects: query.projects.filter(project =>
          project.id !== id
        )
      }
    })
    return client.mutate({
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

  return {
    mutate: deleteProject
  }
}

export function useUpdateProjectMutation () {
  const [updateProjectMutation, updateProjectData] = useMutation(Mutations.UPDATE_PROJECT)
  const mutate = variables => updateProjectMutation({ variables })
  return {
    mutate,
    ...updateProjectData
  }
}

export function useCreateOriginMutation () {
  const [createOriginMutation, createOriginData] = useMutation(Mutations.CREATE_ORIGIN)
  const createOrigin = variables => createOriginMutation({
    optimisticResponse: {
      __typename: Typename.MUTATION,
      insert_origins: {
        __typename: Typename.ORIGINS_MUTATION_RESPONSE,
        returning: [{
          __typename: Typename.ORIGIN,
          id: genKey(),
          name: variables.name,
          project: {
            __typename: Typename.PROJECT,
            id: variables.projectId
          }
        }]
      }
    },
    update: (store, { data: { insert_origins } }) => {
      const query = store.readQuery({
        query: PROJECT_QUERY,
        variables: { id: variables.projectId }
      })
      const { projects } = query
      const [project] = projects
      const origins = [...project.origins].concat(insert_origins.returning)
      store.writeQuery({
        query: PROJECT_QUERY,
        data: {
          projects: [{
            ...project,
            origins
          }]
        },
        variables: { id: variables.projectId }
      })
    }
  })

  return {
    mutation: createOrigin,
    ...createOriginData
  }
}

export function useDeleteOriginMutation () {
  const client = useApolloClient()
  const [deleteOriginMutation, deleteOriginData] = useMutation(Mutations.DELETE_ORIGIN)

  const deleteOrigin = variables => {
    const { projects } = client.cache.readQuery({
      query: PROJECTS_QUERY,
      variables: { id: variables.projectId }
    })
    return deleteOriginMutation({
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
        const origins = [...projects[0].origins]
          .filter(origin => origin.id !== id)
    
        store.writeQuery({
          query: PROJECT_QUERY,
          data: {
            project: {
              ...projects[0],
              origins
            }
          },
          variables: { id: variables.projectId }
        })
      }
    })
  }

  return {
    mutate: deleteOrigin,
    ...deleteOriginData
  }
}

export function useCreateTagMutation () {
  const [createTagMutation, createTagData] = useMutation(Mutations.CREATE_TAG)
  const createTag = async (variables) => {
    const tagId = genKey()
    return createTagMutation({
      variables,
      optimisticResponse: {
        __typename: Typename.MUTATION,
        insert_tags: {
          __typename: Typename.TAGS_MUTATION_RESPONSE,
          returning: [{
            __typename: Typename.TAGS,
            id: tagId,
            name: variables.name,
            description: null,
            created_at: genDate(),
            slug: null
          }]
        },
        insert_posts_tags: {
          __typename: Typename.POSTS_TAGS_MUTATION_RESPONSE,
          returning: [{
            __typename: Typename.POSTS_TAGS,
            post_id: variables.postId,
            tag_id: tagId
          }]
        }
      },
      update: (store, { data: { insert_tags } }) => {
        const { posts_tags } = store.readQuery({
          query: TAG_QUERY,
          variables: { postId: variables.postId }
        })

        store.writeQuery({
          query: TAG_QUERY,
          data: {
            // @ts-ignore
            posts_tags: posts_tags.concat(insert_tags.returning.map(tag => ({ tag })))
          },
          variables: { postId: variables.postId }
        })
      }
    })
  }

  return createTag
}

export function useDeleteTagMutation () {
  const [deleteTagMutation, deleteTagData] = useMutation(Mutations.DELETE_TAG)
  const deleteTag = (variables) => {
    return deleteTagMutation({
      variables,
      optimisticResponse: {
        __typename: Typename.MUTATION,
        delete_tags: {
          __typename: Typename.TAGS_MUTATION_RESPONSE,
          returning: [{
            __typename: Typename.TAGS,
            id: variables.tagId
          }]
        },
        delete_posts_tags: {
          __typename: Typename.POSTS_TAGS_MUTATION_RESPONSE,
          returning: [{
            __typename: Typename.POSTS_TAGS,
            post_id: variables.postId
          }]
        }
      },
      update: (store, { data: { delete_tags } }) => {
        const { posts_tags } : { posts_tags: any[] } = store.readQuery({
          query: TAG_QUERY,
          variables: { postId: variables.postId }
        })
        store.writeQuery({
          query: TAG_QUERY,
          data: {
            posts_tags: posts_tags.filter(c => c.tag.id !== delete_tags.returning[0].id)
          },
          variables: { postId: variables.postId }
        })
      }
    })
  }

  return deleteTag
}

export function useSetSettingMutation () {
  const [mutate, data] = useMutation(Mutations.UPSERT_SETTINGS_MUTATION)
  
  const setSetting = variables => mutate({
    variables,
    optimisticResponse: {
      __typename: Typename.MUTATION,
      insert_settings: {
        __typename: Typename.SETTINGS_MUTATION_RESPONSE,
        returning: [{
          __typename: Typename.SETTING,
          user_id: variables.userId,
          property_name: variables.propertyName,
          property_value: variables.propertyValue
        }]
      }
    },
    update: (store, { data: { insert_settings } }) => {
      const { settings } = store.readQuery({
        query: SETTINGS_QUERY,
        variables: {}
      })

      store.writeQuery({
        query: SETTINGS_QUERY,
        data: {
          settings: settings.filter(({ property_name }) => property_name !== variables.propertyName)
            .concat(insert_settings.returning)
        }
      })
    }
  })

  return setSetting
}