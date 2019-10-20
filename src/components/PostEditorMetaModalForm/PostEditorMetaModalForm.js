import React from 'react'
import PropTypes from 'prop-types'
import PostStatusSelect from '../PostEditorMetaModalSelect'
import ProjectSelect from '../../components/ProjectSelect'
import { compose } from 'react-apollo'
import gql from 'graphql-tag'
import PostMetaDatePicker from '../PostEditorMetaModalDatePicker'
import PostTagChips from '../PostTagChips'
import classes from './styles.scss'
import clsx from 'clsx'
import * as config from '../../lib/config'
import AWS from 'aws-sdk'
import safeKey from 'safe-s3-key'
import withQuery from '../../lib/withQuery'
import ThumbnailUpload from '../ThumbnailUpload'
import Input from '../Input'
import { Grid } from '@material-ui/core'
import { Add } from '@material-ui/icons'

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
  const {
    handleChange,
    handleCoverImageChange,
    post,
    projects,
    selectProject,
    deleteImage
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
      id: id,
      url: `${config.AWS_BUCKET_URL}/${url}`,
      status: 'done'
    }))
    setFileList(fileList)
  }, [images])

  async function action (file) {
    const key = safeKey(`static/${post.id}/${file.name}`)
    const params = {
      Bucket: config.AWS_BUCKET_NAME,
      Fields: {
        key: key,
        'Content-Type': file.type
      }
    }

    await props.createImage({
      url: key,
      postId: props.post.id
    })
    return new Promise((resolve, reject) => {
      s3.createPresignedPost(params, (err, data) => {
        if (err) reject(err)
        resolve(data)
      })
    })
  }

  async function customRequest ({ headers, file, action, onSuccess }) {
    const formData = new window.FormData()
    for (let field in action.fields) {
      formData.append(field, action.fields[field])
    }
    formData.append('file', file)
    const resp = await fetch(action.url, {
      method: 'POST',
      body: formData,
      headers: headers
    })
    onSuccess(resp)
  }

  console.log(props)
  return (
    <form className={classes.root}>
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <Input
            label={'title'}
            onChange={e => handleChange(e.target.value, 'title')}
            value={title}
          />
        </Grid>

        <Grid item xs={6}>
          <PostStatusSelect
            handleChange={handleChange}
            value={status}
          />
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <Input
            placeholder={'slug'}
            onChange={e => handleChange(e.target.value, 'slug')}
            value={slug}
          />
        </Grid>

        <Grid item xs={6}>
          <ProjectSelect
            allProjects={allProjects}
            selectedProject={selectedProject}
            selectProject={selectProject}
          />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={6}>
          <Input
            placeholder={'excerpt'}
            onChange={e => handleChange(e.target.value, 'excerpt')}
            value={excerpt}
          />
        </Grid>
        <Grid item xs={6}>
          <PostMetaDatePicker
            handleChange={value => handleChange(value, 'publishedAt')}
            value={publishedAt}
          />
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <ThumbnailUpload
            customRequest={customRequest}
            action={action}
            fileList={fileList}
            coverImage={post?.coverImage?.id}
            deleteImage={deleteImage}
            onSelect={
              fileId => {
                handleCoverImageChange(fileId)
              }
            }
          >
            <div>
              <Add />
              <div className='ant-upload-text'>Upload</div>
            </div>
          </ThumbnailUpload>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <PostTagChips post={post} />
        </Grid>
      </Grid>
    </form>
  )
}

PostEditorMetaModalForm.propTypes = {
  projects: PropTypes.object.isRequired,
  post: PropTypes.object,
  handleChange: PropTypes.func,
  createImage: PropTypes.func.isRequired
}

export const PROJECTS_QUERY = gql`
  query {
    allProjects {
      id
      name
    }
  }
`

// const PostMetaForm = Form.create({ name: 'post_meta' })(PostEditorMetaModalForm)

const mutations = [
  withQuery({
    options: {
      name: 'projects',
      query: PROJECTS_QUERY
    }
  })
]

export default compose(...mutations)(PostEditorMetaModalForm)
