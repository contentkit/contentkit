import React from 'react'
import PropTypes from 'prop-types'
import PostStatusSelect from '../PostEditorMetaModalSelect'
import ProjectSelect from '../../components/ProjectSelect'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import PostMetaDatePicker from '../PostEditorMetaModalDatePicker'
import PostTagChips from '../PostTagChips'
import Input from 'antd/lib/input'
import classes from './styles.scss'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'

const PostEditorMetaModalForm = (props) => {
  const { handleChange, post, projects, selectProject } = props
  const title = (post?.data?.post?.title) || ''
  const slug = (post?.data?.post?.slug) || ''
  const excerpt = (post?.data?.post?.excerpt) || ''
  const selectedProject = (post?.data?.post?.project?.id) || ''
  const allProjects = (projects?.data?.allProjects) || []
  return (
    <div className={classes.wrapper}>
      <div className={classes.left}>
        <Row gutter={16}>
          <Col span={24}>
            <Input
              label={'title'}
              value={title}
              onChange={e => handleChange(e, 'title')}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <PostStatusSelect
              handleChange={handleChange}
              post={post}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
          <Input
            placeholder={'slug'}
            value={slug}
            onChange={e => handleChange(e, 'slug')}
          />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
          <Input
            placeholder={'excerpt'}
            value={excerpt}
            onChange={e => handleChange(e, 'excerpt')}
          />
          </Col>
        </Row>
      </div>
      <div className={classes.right}>
        <div className={classes.select}>
          <ProjectSelect
            allProjects={allProjects}
            selectedProject={selectedProject}
            selectProject={selectProject}
          />
        </div>
        <PostMetaDatePicker {...props} />
        <PostTagChips post={post} />
      </div>
    </div>
  )
}

PostEditorMetaModalForm.propTypes = {
  projects: PropTypes.object.isRequired,
  post: PropTypes.object,
  handleChange: PropTypes.func
}

export const PROJECTS_QUERY = gql`
  query {
    allProjects {
      id
      name
    }
  }
`

const ModalWithData = props => (
  <Query
    query={PROJECTS_QUERY}
  >
    {projects => {
      if (projects.loading) return false
      return (
        <PostEditorMetaModalForm
          {...props}
          projects={projects}
        />
      )
    }}
  </Query>
)

export default ModalWithData