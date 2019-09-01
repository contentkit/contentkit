import React from 'react'
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
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import withMutation from '../../lib/withMutation'
import { compose } from 'react-apollo'

function CreatePostModal (props) {
  const [title, setTitle] = React.useState('')

  const handleInputChange = evt => setTitle(evt.target.value)

  const onOk = () => {
    const { handleClose, createPost, selectedProject } = props
    handleClose()
    createPost.mutate({
      title: title,
      projectId: selectedProject
    })
  }

  const onCancel = () => {
    props.handleClose()
  }

  const {
    projects,
    selectProject,
    open,
    selectedProject
  } = props
  console.log(props)
  return (
    <Modal
      title={'Create post'}
      visible={open}
      onOk={onOk}
      onCancel={onCancel}
    >
      <Row gutter={8}>
        <Col sm={24} md={18}>
          <Input
            value={title}
            onChange={handleInputChange}
          />
        </Col>
        <Col sm={24} md={6}>
          <ProjectSelect
            selectedProject={selectedProject}
            allProjects={projects?.data?.allProjects}
            selectProject={selectProject}
          />
        </Col>
      </Row>
    </Modal>
  )
}

const mutations = [
  withMutation({
    name: 'createPost',
    options: {
      mutation: CREATE_POST
    },
    mutate: ({ ownProps, variables }) => ({
      variables: variables,
      optimisticResponse: {
        __typename: 'Mutation',
        createPost: {
          __typename: 'Post',
          id: genKey(),
          createdAt: genDate(),
          title: variables.title,
          slug: '',
          publishedAt: genDate(),
          excerpt: '',
          status: 'DRAFT',
          project: {
            __typename: 'Project',
            id: variables.projectId,
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
  }),
  withMutation({
    name: 'updatePost',
    mutate: ({ variables }) => ({ variables }),
    options: {
      mutation: UPDATE_POST
    }
  }),
  withMutation({
    name: 'createProject',
    options: {
      mutation: CREATE_PROJECT
    },
    mutate: ({ variables, ownProps }) => ({
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
        const allProjects = [...ownProps.projects.data.allProjects]
        allProjects.push(createProject)
        store.writeQuery({
          query: PROJECTS_QUERY,
          data: { allProjects },
          variables: ownProps.projects.variables
        })
      }
    })
  })
]

// class CreatePostModalWithData extends React.Component {
//   createProject = ({ mutate }) => (variables) => {
//     return mutate({
//       variables: variables,
//       optimisticResponse: {
//         __typename: 'Mutation',
//         createProject: {
//           __typename: 'Project',
//           id: genKey(),
//           name: variables.name
//         }
//       },
//       update: (store, { data: { createProject } }) => {
//         const allProjects = [...this.props.projects.data.allProjects]
//         allProjects.push(createProject)
//         store.writeQuery({
//           query: PROJECTS_QUERY,
//           data: { allProjects },
//           variables: this.props.projects.variables
//         })
//       }
//     })
//   }

//   updatePost = ({ mutate }) =>
//     (variables) => mutate({ variables })

//   render () {
//     return (
//       <Mutation mutation={CREATE_POST}>
//         {(createPostMutation, createPostData) => {
//           return (
//             <Mutation mutation={CREATE_PROJECT}>
//               {(createProject, createProjectData) => {
//                 return (
//                   <Mutation mutation={UPDATE_POST}>
//                     {(updatePost, updatePostData) => {
//                       return (
//                         <CreatePostModal
//                           {...this.props}
//                           createPost={{
//                             mutate: createPost({
//                               mutate: createPostMutation,
//                               ownProps: this.props
//                             }),
//                             ...createPostData
//                           }}
//                           createProject={{
//                             mutate: this.createProject({
//                               mutate: createProject,
//                               ownProps: this.props
//                             }),
//                             ...createProjectData
//                           }}
//                           updatePost={{
//                             mutate: this.updatePost({
//                               mutate: updatePost
//                             }),
//                             ...updatePostData
//                           }}
//                         />
//                       )
//                     }}
//                   </Mutation>
//                 )
//               }}
//             </Mutation>
//           )
//         }}
//       </Mutation>
//     )
//   }
// }

export default compose(...mutations)(CreatePostModal)
