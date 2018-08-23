// @flow
import React from 'react'
import PropTypes from 'prop-types'
import EnhancedInput from '../../components/EnhancedInput'
import PostStatusSelect from '../PostEditorMetaModalSelect'
import ProjectSelect from '../../components/ProjectSelect'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import PostMetaDatePicker from '../PostEditorMetaModalDatePicker'
import FormControl from '@material-ui/core/FormControl'

const PostEditorMetaModalForm = (props) => {
  const { handleChange, post, projects, selectProject } = props
  const { Post } = post
  const title = (Post && Post.postMeta.title) || ''
  const slug = (Post && Post.postMeta.slug) || ''
  const excerpt = (Post && Post.postMeta.excerpt) || ''
  const selectedProject = (Post && Post.project.id) || ''
  const allProjects = (projects && projects.data.allProjects) || []
  return (
    <div className='modal-content'>
      <EnhancedInput
        label={'title'}
        value={title}
        onChange={e => handleChange(e, 'title')}
      />
      <PostStatusSelect
        handleChange={handleChange}
        post={post}
      />
      <EnhancedInput
        label={'slug'}
        value={slug}
        onChange={e => handleChange(e, 'slug')}
      />
      <EnhancedInput
        multiline
        label={'excerpt'}
        value={excerpt}
        onChange={e => handleChange(e, 'excerpt')}
      />
      <ProjectSelect
        allProjects={allProjects}
        selectedProject={selectedProject}
        selectProject={selectProject}
      />
      <FormControl fullWidth margin={'normal'}>
        <PostMetaDatePicker
          {...props}
        />
      </FormControl>
    </div>
  )
}

PostEditorMetaModalForm.propTypes = {
  post: PropTypes.object,
  handleChange: PropTypes.func
}

export const PROJECTS_QUERY = gql`
  query ($id: ID!) {
    allProjects(filter: {
      user: {
        id: $id
      }
    }) {
      id
      name
    }
  }
`

export default props => (
  <Query
    query={PROJECTS_QUERY}
    variables={{ id: props.auth.user.id }}
  >
    {projects => {
      console.log(projects)
      return (
        <PostEditorMetaModalForm
          {...props}
          projects={projects}
        />
      )
    }}
  </Query>
)
