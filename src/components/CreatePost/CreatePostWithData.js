// @flow
import React from 'react'
import { Mutation } from 'react-apollo'
import {
  CREATE_POST,
  CREATE_PROJECT,
  UPDATE_POST
} from '../../graphql/mutations'
import {
  FEED_QUERY,
  PROJECTS_QUERY
} from '../../graphql/queries'

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

const createPost = ({ mutate, ownProps }) => ({ title, projectId }) => {
  return mutate({
    variables: { projectId, title },
    optimisticResponse: {
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
          id: projectId,
          name: ''
        }
      }
    },
    update: (store, { data: { createPost } }) => {
      const posts = [...ownProps.feed.data.feed.posts]
      posts.unshift(createPost)
      store.writeQuery({
        query: FEED_QUERY,
        data: {
          ...ownProps.feed.data,
          feed: {
            ...ownProps.feed.data.feed,
            posts: posts
          }
        },
        variables: ownProps.feed.variables
      })
    }
  })
}

class CreatePostWithData extends React.Component<Props> {
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
        {(createPostMutation, createPostData) => {
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
                            mutate: createPost({
                              mutate: createPostMutation,
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

export default CreatePostWithData
