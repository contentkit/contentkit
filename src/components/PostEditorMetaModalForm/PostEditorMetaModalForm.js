// @flow
import React from 'react'
import PropTypes from 'prop-types'
import EnhancedInput from '../../components/EnhancedInput'
import PostStatusSelect from '../PostEditorMetaModalSelect'
import ProjectSelect from '../../components/ProjectSelect'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import PostMetaDatePicker from '../PostEditorMetaModalDatePicker'
import FormControl from '@material-ui/core/FormControl'

const PostEditorMetaModalForm = (props) => {
  const { handleChange, post, projects } = props
  const { Post } = post
  const title = (Post && Post.postMeta.title) || ''
  const slug = (Post && Post.postMeta.slug) || ''
  const excerpt = (Post && Post.postMeta.excerpt) || ''
  const selectedProject = (Post && Post.project.id) || ''
  const allProjects = (projects && projects.data.allProjects) || []
  return (
    <div className='modal-content'>
      <div className='modal-left'>
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
          selectProject={() => {}}
        />
        <FormControl fullWidth margin={'normal'}>
          <PostMetaDatePicker
            {...props}
          />
        </FormControl>
      </div>
      <div className='modal-right' />
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
      return <PostEditorMetaModalForm {...props} projects={projects} />
    }}
  </Query>
)
