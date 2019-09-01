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
import Icon from 'antd/lib/Icon'
import clsx from 'clsx'
import * as config from '../../lib/config'
import Upload from 'antd/lib/upload'
import AWS from 'aws-sdk'
import uuid from 'uuid/v4'
import safeKey from 'safe-s3-key'

AWS.config.region = config.AWS_REGION
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: config.IDENTITY_POOL_ID
})
const s3 = new AWS.S3()

const defaultPost = {
  title: '',
  slug: '',
  excerpt: '',
  coverImage: {},
  publishedAt: '',
  images: [],
  project: {},
  status: null
}

function PostEditorMetaModalForm (props) {
  console.log(props)
  const {
    handleChange,
    handleCoverImageChange,
    post,
    projects,
    selectProject
  } = props
  const {
    title,
    slug,
    excerpt,
    coverImage,
    publishedAt,
    images,
    project,
    status
  } = { ...defaultPost, ...post }

  const [fileList, setFileList] = React.useState([])

  const selectedProject = project?.id
  const allProjects = projects?.data?.allProjects || []

  React.useEffect(() => {
    const fileList = images.map(({ id, url }) => ({
      uid: id,
      url: `${config.AWS_BUCKET_URL}/${url}`,
      status: 'done'
    }))
    setFileList(fileList)
  }, [images])

  function action (file) {
    const params = {
      Bucket: config.AWS_BUCKET_NAME,
      Fields: {
        key: safeKey(`${uuid()}-${file.name}`),
        'Content-Type': file.type
      }
    }

    return new Promise((resolve, reject) => {
      s3.createPresignedPost(params, (err, data) => {
        if (err) reject(err)
        resolve(data)
      })
    })
  }

  function customRequest ({ headers, file, action }) {
    const formData = new window.FormData()
    for (let field in action.fields) {
      formData.append(field, action.fields[field])
    }
    formData.append('file', file)
    return fetch(action.url, {
      method: 'POST',
      body: formData,
      headers: headers
    })
  }

  return (
    <Form className={classes.root}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label={'Title'}>
            <Input
              label={'title'}
              onChange={e => handleChange(e.target.value, 'title')}
              value={title}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label={'Status'}>
            <PostStatusSelect
              handleChange={handleChange}
              value={status}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label={'Slug'}>
            <Input
              placeholder={'slug'}
              onChange={e => handleChange(e.target.value, 'slug')}
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
              onChange={e => handleChange(e.target.value, 'excerpt')}
              value={excerpt}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label={'Date'}>
            <PostMetaDatePicker
              handleChange={value => handleChange(value, 'publishedAt')}
              value={publishedAt}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Upload
            customRequest={customRequest}
            action={action}
            listType='picture-card'
            fileList={fileList}
            onPreview={(...args) => console.log('preview', args)}
            onChange={(...args) => console.log('change', args)}
          >
            <div>
              <Icon type='plus' />
              <div className='ant-upload-text'>Upload</div>
            </div>
          </Upload>
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
  <Query query={PROJECTS_QUERY}>
    {projects => {
      if (projects.loading) {
        return null
      }
      return (
        <PostMetaForm {...props} projects={projects} />
      )
    }}
  </Query>
)

export default ModalWithData
