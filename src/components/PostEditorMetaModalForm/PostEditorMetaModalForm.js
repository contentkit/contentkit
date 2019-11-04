import React from 'react'
import PropTypes from 'prop-types'
import PostStatusSelect from '../PostEditorMetaModalSelect'
import ProjectSelect from '../../components/ProjectSelect'
import { compose } from 'react-apollo'
import gql from 'graphql-tag'
import PostMetaDatePicker from '../PostEditorMetaModalDatePicker'
import PostTagChips from '../PostTagChips'
import clsx from 'clsx'
import * as config from '../../lib/config'
import AWS from 'aws-sdk'
import safeKey from 'safe-s3-key'
import withQuery from '../../lib/withQuery'
import ThumbnailUpload from '../ThumbnailUpload'
import Input from '../Input'
import FormInput from '../FormInput'

import { Grid, FormControl, InputLabel } from '@material-ui/core'
import { Add } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'

AWS.config.region = config.AWS_REGION
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: config.IDENTITY_POOL_ID
})

const s3 = new AWS.S3()

const useStyles = makeStyles(theme => ({
  thumbnail: {
    width: '100%',
    height: '100%'
  },
  selected: {
    backgroundColor: 'green'
  },
  gutter: {
    marginBottom: theme.spacing(2)
  }
}))

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
  const classes = useStyles()
  const {
    handleChange,
    handleCoverImageChange,
    post,
    users,
    projects,
    selectProject,
    deleteImage
  } = props
  const {
    title,
    slug,
    excerpt,
    cover_image,
    published_at,
    images,
    project,
    status
  } = { ...defaultPost, ...post }

  const [fileList, setFileList] = React.useState([])

  const selectedProject = project?.id
  const allProjects = projects?.data?.projects || []

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

    const userId = users.data.users[0].id

    await props.createImage({
      url: key,
      postId: props.post.id,
      userId: userId
    })

    return props.getFormData({
      key, userId
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

  return (
    <form className={classes.root}>
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <FormInput
            label={'title'}
            onChange={e => handleChange(e.target.value, 'title')}
            value={title}
            fullWidth
            label={'Title'}
          />
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel shrink>Status</InputLabel>
            <PostStatusSelect
              handleChange={handleChange}
              value={status}
            />
          </FormControl>
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs={6}>
            <FormInput
              placeholder={'slug'}
              onChange={e => handleChange(e.target.value, 'slug')}
              value={slug}
              fullWidth
              label='Slug'
            />
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel shrink>Project</InputLabel>
            <ProjectSelect
              allProjects={allProjects}
              selectedProject={selectedProject}
              selectProject={selectProject}
            />
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={6}>
            <FormInput
              placeholder={'excerpt'}
              onChange={e => handleChange(e.target.value, 'excerpt')}
              value={excerpt}
              fullWidth
              label={'Excerpt'}
            />
        </Grid>
        <Grid item xs={6}>
          <PostMetaDatePicker
            handleChange={value => handleChange(value, 'published_at')}
            value={published_at}
          />
        </Grid>
      </Grid>
      <Grid container spacing={4} className={classes.gutter}>
        <Grid item xs={12}>
          <ThumbnailUpload
            customRequest={customRequest}
            action={action}
            fileList={fileList}
            coverImage={post?.cover_image_id}
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
          <PostTagChips post={post} users={users} />
        </Grid>
      </Grid>
    </form>
  )
}

PostEditorMetaModalForm.propTypes = {
  projects: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  handleChange: PropTypes.func,
  createImage: PropTypes.func.isRequired
}

export const PROJECTS_QUERY = gql`
  query {
    projects {
      id
      name
    }
  }
`

const mutations = [
  withQuery({
    options: {
      name: 'projects',
      query: PROJECTS_QUERY
    }
  })
]

export default compose(...mutations)(PostEditorMetaModalForm)
