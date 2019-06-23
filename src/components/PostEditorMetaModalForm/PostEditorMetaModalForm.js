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
import Form from 'antd/lib/form'

const PostEditorMetaModalForm = (props) => {
  const { handleChange, post, projects, selectProject } = props
  const title = (post?.data?.post?.title) || ''
  const slug = (post?.data?.post?.slug) || ''
  const excerpt = (post?.data?.post?.excerpt) || ''
  const selectedProject = (post?.data?.post?.project?.id) || ''
  const allProjects = (projects?.data?.allProjects) || []
  const { getFieldDecorator } = props.form
  return (
    <Form className={classes.root}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label={'Title'}>
            <Input
              label={'title'}
              onChange={e => handleChange(e, 'title')}
              value={title}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label={'Status'}>
            <PostStatusSelect
              handleChange={handleChange}
              post={post}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label={'Slug'}>
            <Input
              placeholder={'slug'}
              onChange={e => handleChange(e, 'slug')}
              value={slug}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label={'Project'}>
            <ProjectSelect
              allProjects={allProjects}
              selectedProject={selectedProject}
              selectProject={selectProject}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label={'Excerpt'}>
            <Input
              placeholder={'excerpt'}
              onChange={e => handleChange(e, 'excerpt')}
              value={excerpt}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label={'Date'}>
            <PostMetaDatePicker {...props} />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Form.Item> 
            <PostTagChips post={post} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
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

const PostMetaForm = Form.create({ name: 'post_meta' })(PostEditorMetaModalForm)

const ModalWithData = props => (
  <Query
    query={PROJECTS_QUERY}
  >
    {projects => {
      if (projects.loading) return false
      return (
        <PostMetaForm
          {...props}
          projects={projects}
        />
      )
    }}
  </Query>
)

export default ModalWithData
