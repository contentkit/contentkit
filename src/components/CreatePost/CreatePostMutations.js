// @flow
import React from 'react'
import { Mutation } from 'react-apollo'
import { CREATE_POST, CREATE_PROJECT, UPDATE_POST } from './mutations'
import { POSTS_QUERY, PROJECTS_QUERY } from '../../containers/Dashboard/queries'
import CreatePost from './CreatePost'
import { genKey, genDate } from '../../lib/util'
import type { Document, PostMeta, ProjectsQuery, PostsQuery } from '../../types'

type Props = {
  projects: ProjectsQuery,
  posts: PostsQuery,
  client: any,
}

type createPostVariables = {
  projectId: string,
  userId: string,
  postMeta: PostMeta,
  document: Document
}

type createPostMutation = ({
  variables: createPostVariables,
  optimisticResponse: any,
  update: (store: { writeQuery: (data: any) => void }, { data: { createPost: { Post: Post } } }) => any
}) => Promise<any>

class CreatePostMutations extends React.Component<Props> {
  createPost = ({ mutate, ownProps }) =>
    ({
      title,
      projectId
    }: {
      projectId: string,
      title: string
    }) => {
      let { allProjects } = this.props.projects.data
      let project = allProjects.find(({ id }) => id === projectId)

      const optimisticResponse = {
        __typename: 'Mutation',
        createPost: {
          __typename: 'Post',
          id: genKey(),
          createdAt: genDate(),
          title: title,
          slug: '',
          publishedAt: genDate(),
          excerpt: null,
          status: 'DRAFT',
          project: {
            __typename: 'Project',
            ...(project || { id: projectId })
          },
          document: {
            __typename: 'Document',
            id: genKey(),
            raw: null,
            versions: [{
              __typename: 'Version',
              id: genKey()
            }]
          }
        }
      }
      return mutate({
        variables: { projectId, title },
        optimisticResponse,
        update: (store, { data: { createPost } }) => {
          const allPosts = [...ownProps.posts.data.allPosts]
          allPosts.unshift(createPost)
          let data = {
            query: POSTS_QUERY,
            data: { allPosts },
            variables: ownProps.posts.variables
          }
          store.writeQuery(data)
        }
      })
    }

  createProject = ({ mutate }) => (variables: { name: string }) => {
    return mutate({
      variables: variables,
      optimisticResponse: {
        __typename: 'Mutation',
        createProject: {
          __typename: 'Project',
          id: genKey(),
          name: variables.name
        }
      },
      update: (store, { data: { createProject } }) => {
        const allProjects = [...this.props.projects.data.allProjects]
        allProjects.push(createProject)
        store.writeQuery({
          query: PROJECTS_QUERY,
          data: { allProjects },
          variables: this.props.projects.variables
        })
      }
    })
  }

  updatePost = ({ mutate }) =>
    (variables: { id: string }) => mutate({ variables })

  render () {
    return (
      <Mutation mutation={CREATE_POST}>
        {(createPost, createPostData) => {
          return (
            <Mutation mutation={CREATE_PROJECT}>
              {(createProject, createProjectData) => {
                return (
                  <Mutation mutation={UPDATE_POST}>
                    {(updatePost, updatePostData) => {
                      return (
                        <CreatePost
                          {...this.props}
                          createPost={{
                            mutate: this.createPost({
                              mutate: createPost,
                              ownProps: this.props
                            }),
                            ...createPostData
                          }}
                          createProject={{
                            mutate: this.createProject({
                              mutate: createProject,
                              ownProps: this.props
                            }),
                            ...createProjectData
                          }}
                          updatePost={{
                            mutate: this.updatePost({
                              mutate: updatePost,
                              ownProps: this.props
                            }),
                            ...updatePostData
                          }}
                        />
                      )
                    }}
                  </Mutation>
                )
              }}
            </Mutation>
          )
        }}
      </Mutation>
    )
  }
}

export default CreatePostMutations
