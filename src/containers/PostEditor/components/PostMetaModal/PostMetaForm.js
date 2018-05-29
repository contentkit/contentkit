// @flow
import React from 'react'
import PropTypes from 'prop-types'
import EnhancedInput from '../../../../components/EnhancedInput'
import PostStatusSelect from './PostStatusSelect'
import ProjectSelect from '../../../../components/ProjectSelect'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const PostMetaForm = (props) => {
  const { handleChange, post, projects } = props
  const { Post } = post
  const title = Post?.postMeta?.title || Post?.title || '' /* eslint-disable-line */
  const slug = Post?.postMeta?.slug || Post?.slug || '' /* eslint-disable-line */
  const excerpt = Post?.document?.excerpt || Post?.excerpt || '' /* eslint-disable-line */
  const selectedProject = Post?.project?.id || ''
  const allProjects = projects?.data?.allProjects || []

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
      </div>
      <div className='modal-right' />
    </div>
  )
}

PostMetaForm.propTypes = {
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
      return <PostMetaForm {...props} projects={projects} />
    }}
  </Query>
)
