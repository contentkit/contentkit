import React from 'react'
import PropTypes from 'prop-types'
import PostStatusSelect from '../PostEditorMetaModalSelect'
import ProjectSelect from '../ProjectSelect'
import gql from 'graphql-tag'
import PostMetaDatePicker from '../PostEditorMetaModalDatePicker'
import PostTagChips from '../PostTagChips'
import clsx from 'clsx'
import * as config from '../../lib/config'
import AWS from 'aws-sdk'
import safeKey from 'safe-s3-key'
import { useQuery } from '@apollo/react-hooks'
// import ThumbnailUpload from '../ThumbnailUpload'
import { Input, ThumbnailUpload } from '@contentkit/components'
import FormInput from '../FormInput'

import { Grid, FormControl, InputLabel } from '@material-ui/core'
import { Add } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import chunk from 'lodash.chunk'

// AWS.config.region = config.AWS_REGION
// AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//   IdentityPoolId: config.IDENTITY_POOL_ID
// })

// const s3 = new AWS.S3()

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

enum FieldType {
  FORM_INPUT = 'form_input',
  FORM_SELECT = 'form_select',
  CUSTOM = 'custom'
}

function PostEditorMetaModalForm (props) {
  const classes = useStyles(props)
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

  const customRequest = async ({ headers, file, action, onSuccess }) => {
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

  const fields = [
    {
      key: 'title',
      label: 'Title',
      type: FieldType.FORM_INPUT,
      size: 6
    },
    {
      key: 'status',
      label: 'Status',
      type: FieldType.FORM_SELECT,
      Component: PostStatusSelect,
      size: 6,
      getComponentProps: () => ({
        handleChange,
        value: post.status
      })
    },
    {
      key: 'slug',
      label: 'Slug',
      type: FieldType.FORM_INPUT,
      size: 6
    },
    {
      key: 'project',
      label: 'Project',
      type: FieldType.FORM_SELECT,
      Component: ProjectSelect,
      getComponentProps: () => ({
        allProjects, selectedProject, selectProject
      }),
      size: 6
    },
    {
      key: 'excerpt',
      label: 'Excerpt',
      type: FieldType.FORM_INPUT,
      size: 6
    },
    {
      key: 'published_at',
      label: 'published_at',
      type: FieldType.FORM_SELECT,
      Component: PostMetaDatePicker,
      getComponentProps: () => ({
        handleChange: (value) => handleChange(value, 'published_at'),
        value: post.published_at
      }),
      size: 6
    },
    // {
    //   key: 'images',
    //   label: 'Upload',
    //   type: FieldType.CUSTOM,
    //   Component: ThumbnailUpload,
    //   size: 12
    // },
    // {
    //   key: 'tags',
    //   label: 'Tags',
    //   Component: PostTagChips,
    //   size: 12
    // }
  ]

  const children = fields.map(({ label, key, type, Component, getComponentProps }) => {
    if (type === FieldType.FORM_INPUT) {
      return (
        <FormInput
          label={label}
          onChange={e => handleChange(e.target.value, key)}
          value={post[key]}
          fullWidth
        />
      )
    }

    if (type === FieldType.FORM_SELECT) {
      return (
        <FormControl fullWidth>
          <InputLabel shrink>{label}</InputLabel>
          <Component {...getComponentProps()} />
        </FormControl>
      )
    }
  })

  return (
    <form className={classes.root}>
      {chunk(children, 2).map((row) => {
        const [left, right] = row
        if (row.length > 1) {
          return (
            <Grid container spacing={4}>
              <Grid item xs={6}>{left}</Grid>
              <Grid item xs={6}>{right}</Grid>
            </Grid>
          )
        }

        return (
          <Grid container spacing={4}>
            <Grid item xs={12}>{left}</Grid>
          </Grid>
        )
      })}
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

function MetaModalWithQuery (props) {
  const projects = useQuery(PROJECTS_QUERY)

  if (projects.loading) {
    return null
  }

  return (
    <PostEditorMetaModalForm {...props} projects={projects} /> 
  )
}

export default MetaModalWithQuery
