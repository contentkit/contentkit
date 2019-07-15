import React from 'react'
import { Mutation } from 'react-apollo'
import Modal from 'antd/lib/modal'
import Input from 'antd/lib/input'
import {
  CREATE_POST,
  CREATE_PROJECT,
  UPDATE_POST
} from '../../graphql/mutations'
import {
  FEED_QUERY,
  PROJECTS_QUERY
} from '../../graphql/queries'
import { genKey, genDate } from '../../lib/util'
import ProjectSelect from '../ProjectSelect'

function CreatePostModal (props) {
  const [title, setTitle] = React.useState('')
  const [selectedProject, setSelectedProject] = React.useState(null)

  const handleInputChange = evt => setTitle(evt.target.value)

  React.useEffect(() => {
    const { projects: { data: { allProjects } } } = props
    setSelectedProject(
      allProjects.find(({ id }) => id === props.selectedProject)
    )
  }, [props.selectedProject])

  const {
    projects,
    selectProject
  } = props
  return (
    <Modal
      title={'Create post'}
      visible={props.visible}
      onOK={() => {}}
      onCancel={() => {}}
    >
      <Input
        value={title}
        onChange={handleInputChange}
      />
      <ProjectSelect
        selectedProject={selectedProject}
        allProjects={projects?.data?.allProjects}
        selectProject={selectProject}
      />
    </Modal>
  )
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
        },
        tags: []
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

class CreatePostModalWithData extends React.Component {
  createProject = ({ mutate }) => (variables) => {
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
    (variables) => mutate({ variables })

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
                        <CreatePostModal
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
                              mutate: updatePost
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

export default CreatePostModalWithData
