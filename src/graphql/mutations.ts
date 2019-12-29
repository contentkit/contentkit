import gql from 'graphql-tag'
import { POST_QUERY, USER_QUERY, PROJECTS_QUERY, PROJECT_QUERY, TAG_QUERY } from './queries'
import { useMutation, useApolloClient } from '@apollo/react-hooks'
import { genKey, genDate } from '../lib/util'

export const DELETE_POST = gql`
  mutation ($id: String!, $userId: String!) {
    delete_posts(where: { id: { _eq: $id }, user_id: { _eq: $userId } }) {
      returning {
        id
      }
    }
  }
`

export const CREATE_POST = gql`
  mutation createPost($userId: String!, $title: String!, $projectId: String!) {
    insert_posts(objects: { user_id: $userId, title: $title, project_id: $projectId }) {
      returning {
        id
        created_at
        published_at
        title
        slug
        status
        excerpt
        project {
          id
          name
        }
        posts_tags {
          tag {
            id
            name
          }
        }
      }
    }
  }
`

export const CREATE_PROJECT = gql`
  mutation ($userId: String!, $name: String!) {
    insert_projects(objects: {
      name: $name,
      user_id: $userId
    }) {
      returning {
        name
        id
      }
    }
  }
`

export const UPDATE_DOCUMENT = gql`
  mutation (
    $id: String!
    $raw: jsonb!
    $encodedHtml: String!
  ) {
    update_posts (
      _set: { raw: $raw, encoded_html: $encodedHtml },
      where: { id: { _eq: $id } }
    ) {
      returning {
        id
        created_at
        images {
          id
          url
        }
        raw
        encoded_html
        title
        slug
        status
        excerpt 
      }
    }
  }
`

export const UPDATE_POST = gql`
  mutation (
    $id: String!
    $title: String!
    $status: post_status!
    $publishedAt: String!
    $excerpt: String!
  ) {
    update_posts (
      _set: { title: $title, status: $status, published_at: $publishedAt, excerpt: $excerpt },
      where: { id: { _eq: $id } }
    ) {
      returning {
        id
        created_at
        images {
          id
          url
        }
        raw
        encoded_html
        title
        slug
        status
        excerpt 
      }
    }
  }
`

export const CREATE_IMAGE = gql`
  mutation ($url: String!, $postId: String!, $userId: String!) {
    insert_images (objects: { url: $url, post_id: $postId, user_id: $userId }) {
      returning {
        id
        url
      }
    } 
  }
`

export const DELETE_IMAGE = gql`
  mutation ($id: String!) {
    delete_images (where: { id: { _eq: $id } }) {
      returning {
        id
      }
    } 
  }
`

export const UPDATE_USER = gql`
  mutation updateUser($id: String!, $name: String!, $email: String!) {
    update_users(where: { id: { _eq: $id } }, _set: { name: $name, email: $email }) {
      returning {
        id,
        email,
        name,
        secret
      }
    }
  }
`

export const GENERATE_TOKEN = gql`
  mutation {
    generateToken {
      id
      secret
    }
  }
`

export const GET_TOKEN = gql`
  mutation {
    getToken {
      token
    }
  }
`

export const UPDATE_PROJECT = gql`
  mutation ($id: String!, $name: String!, $userId: String!) {
    update_projects(where: { id: { _eq: $id } }, _set: { name: $name }) {
      returning {
        id
        name
      }
    }
  }
`

export const DELETE_PROJECT = gql`
  mutation ($id: String!) {
    delete_projects(where: { id: { _eq: $id } }) {
      returning { 
        id
      }
    }
  }
`

export const AUTHENTICATE_USER = gql`
  mutation(
    $email: String!
    $password: String!
  ) {
    login(
      email: $email,
      password: $password
    ) {
      token
    }
  }
`

export const SIGNUP_USER = gql`
  mutation(
    $email: String!,
    $password: String!,
  ) {
    register(
      email: $email,
      password: $password
    ) {
      token
    }
  }
`

export const DELETE_ORIGIN = gql`
  mutation ($id: String!) {
    delete_origins (where: { id: { _eq: $id } }) {
      returning {
        id
      }
    }
  }
`

export const DELETE_TAG = gql`
  mutation ($tagId: String!, $postId: String!) {
    delete_posts_tags(where: { tag_id: { _eq: $tagId }, post_id: { _eq: $postId } }) {
      returning {
        post_id
      }
    }
    delete_tags (where: { id: { _eq: $tagId } }) {
      returning {
        id
      }
    }
  }
`

export const CREATE_ORIGIN = gql`
  mutation ($projectId: String!, $name: String!, $userId: String!) {
    insert_origins (
      objects: [{
        project_id: $projectId,
        name: $name,
        user_id: $userId
      }]
    ) {
      returning {
        name
        id
        project {
          id
        }
      }
    }
  }
`

export const CREATE_TAG = gql`
  mutation ($name: String, $projectId: String!, $userId: String!, $postId: String!, $tagId: String!) {
    insert_tags(objects: [{ id: $tagId, user_id: $userId, name: $name, project_id: $projectId }]) {
      returning {
        name
        id
        description
        slug
      }
    }
    insert_posts_tags(
      objects: [{
        tag_id: $tagId,
        post_id: $postId
      }]
    ) {
      returning {
        tag_id
        post_id
      }
    }
  }
`

export const CREATE_POST_TAG_CONNECTION = gql`
  mutation ($tagId: String!, $postId: String!) {
    insert_posts_tags(objects: [{
      tag_id: $tagId,
      post_id: $postId
    }]) {
      returning {
        tag_id
        post_id
      }
    }
  }
`
export const DELETE_USER = gql`
  mutation($userId: String!) {
    delete_users(
      where: { id: { _ew: $userId } } ) 
    {
      returning {
        id
      }
    }
  }
`

export const UPLOAD_MUTATION = gql`
  mutation($userId: String!, $key: String!) {
    createPresignedPost(userId: $userId, key: $key) {
      url
      fields
    }
  }
`

export function useCreateImage () {
  const [createImageMutation] = useMutation(CREATE_IMAGE)
  const createImage = variables => createImageMutation({
    variables,
    optimisticResponse: {
      __typename: 'Mutation',
      insert_images: {
        __typename: 'images_mutation_response',
        returning: [{
          __typename: 'Image',
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
  const [deleteImageMutation] = useMutation(DELETE_IMAGE)
  const deleteImage = variables => deleteImageMutation({
    variables,
    optimisticResponse: {
      __typename: 'Mutation',
      delete_images: {
        __typename: 'images_mutation_response',
        response: [{
          __typename: 'Image',
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

export function useUpdateDocument () {
  const client = useApolloClient()
  const [updateDocumentMutation, data] = useMutation(UPDATE_DOCUMENT)
  const mutate = variables => {
    const { posts } : { posts: any[] } = client.cache.readQuery({
      query: POST_QUERY,
      variables: { id: variables.id }
    })
  
    return updateDocumentMutation({
      variables,
      optimisticResponse: {
        __typename: 'Mutation',
        update_posts: {
          __typename: 'posts_mutation_response',
          returning: [{
            __typename: 'Post',
            ...posts[0],
            // ...posts.data.posts[0],
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
    })
  }

  return {
    mutate,
    ...data
  }
}

export function useGenerateToken () {
  const client = useApolloClient()
  const [generateTokenMutation, data] = useMutation(GENERATE_TOKEN)
  const mutate = variables => {
    const { users } = client.cache.readQuery({
      query: USER_QUERY
    })
  
    return generateTokenMutation({
      variables,
      optimisticResponse: {
        __typename: 'Mutation',
        generateToken: {
          __typename: 'User',
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
  const [updateUserMutation, updateUserData] = useMutation(UPDATE_USER)
  return (variables) => {
    return updateUserMutation({ variables })
  }
}


export function useDeleteUser () {
  const client = useApolloClient()
  const [updateUserMutation, data] = useMutation(UPDATE_USER)
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
  const [mutate, data] = useMutation(CREATE_PROJECT)

  const createProject = variables => mutate({
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
  const [updateProjectMutation, updateProjectData] = useMutation(UPDATE_PROJECT)
  const mutate = variables => updateProjectMutation({ variables })
  return {
    mutate,
    ...updateProjectData
  }
}

export function useCreateOriginMutation () {
  const [createOriginMutation, createOriginData] = useMutation(CREATE_ORIGIN)
  const createOrigin = variables => createOriginMutation({
    optimisticResponse: {
      __typename: 'Mutation',
      insert_origins: {
        __typename: 'origins_mutation_response',
        returning: [{
          __typename: 'Origin',
          id: genKey(),
          name: variables.name,
          project: {
            __typename: 'Project',
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

export function useCreateTagMutation () {
  const [createTagMutation, createTagData] = useMutation(CREATE_TAG)
  const createTag = async (variables) => {
    const tagId = genKey()
    return createTagMutation({
      variables,
      optimisticResponse: {
        __typename: 'Mutation',
        insert_tags: {
          __typename: 'tags_mutation_response',
          returning: [{
            __typename: 'tags',
            id: tagId,
            name: variables.name,
            description: null,
            created_at: genDate(),
            slug: null
          }]
        },
        insert_posts_tags: {
          __typename: 'posts_tags_mutation_response',
          returning: [{
            __typename: 'posts_tags',
            post_id: variables.postId,
            tag_id: tagId
          }]
        }
      },
      update: (store, { data: { insert_tags } }) => {
        const { post_tags } = store.readQuery({
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
  const [deleteTagMutation, deleteTagData] = useMutation(DELETE_TAG)
  const deleteTag = (variables) => deleteTagMutation({
    variables,
    optimisticResponse: {
      __typename: 'Mutation',
      delete_tags: {
        __typename: 'tags_mutation_response',
        returning: [{
          __typename: 'Tag',
          id: variables.tagId
        }]
      }
    },
    update: (store, { data: { delete_tags } }) => {
      const { posts_tags } : { posts_tags: any[] } = store.readQuery({
        query: TAG_QUERY,
        variables: { id: variables.tagId }
      })
      store.writeQuery({
        query: TAG_QUERY,
        data: {
          posts_tags: posts_tags.filter(c => c.tag.id !== delete_tags.returning[0].id)
        },
        variables: { id: variables.tagId }
      })
    }
  })

  return deleteTag
}