import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import clsx from 'clsx'
import safeKey from 'safe-s3-key'
import { useQuery } from '@apollo/react-hooks'
import { Input, ThumbnailUpload } from '@contentkit/components'
import { Grid, FormControl, InputLabel } from '@material-ui/core'
import { Add } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import chunk from 'lodash.chunk'

import PostStatusSelect from '../PostEditorMetaModalSelect'
import ProjectSelect from '../ProjectSelect'
import PostMetaDatePicker from '../PostEditorMetaModalDatePicker'
import PostTagChips from '../PostTagChips'
import * as config from '../../lib/config'
import FormInput from '../FormInput'


const useStyles = makeStyles((theme: any) => ({
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
    onChange,
    onCoverImageChange,
    post,
    users,
    projects,
    selectProject,
    deleteImage,
    mediaProvider
  } = props

  const { images, project } = post

  const selectedProject = project?.id
  const allProjects = projects?.data?.projects || []

  const getUploadMediaOptions = (file) => {
    const key = safeKey(`static/${post.id}/${file.name}`)
    return {
      key: key,
      url: key,
      postId: post.id,
      userId: users.data.users[0].id
    }
  }
  // const onUpload = async (file) => {
  //   const key = safeKey(`static/${post.id}/${file.name}`)
  //   const params = {
  //     Bucket: config.AWS_BUCKET_NAME,
  //     Fields: {
  //       key: key,
  //       'Content-Type': file.type
  //     }
  //   }

  //   const userId = users.data.users[0].id

  //   try {
  //     await props.createImage({
  //       url: key,
  //       postId: props.post.id,
  //       userId: userId
  //     })
  //   } catch (err) {
  //     console.error(err)
  //     return
  //   }

  //   const data = await props.getFormData({ key, userId })
  //   await customRequest(file, data)
  // }

  const customRequest = (file, action) => {
    const formData = new window.FormData()
    for (let field in action.fields) {
      formData.append(field, action.fields[field])
    }
    formData.append('file', file)
    return fetch(action.url, {
      method: 'POST',
      body: formData,
    })
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
        onChange,
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
        onChange: (value) => onChange(value, 'published_at'),
        value: post.published_at || post.created_at
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

  const thumbnailUploadSelection = post?.cover_image_id
    ? [post.cover_image_id]
    : []

  const children = fields.map(({ label, key, type, Component, getComponentProps }) => {
    if (type === FieldType.FORM_INPUT) {
      return (
        <FormInput
          label={label}
          onChange={e => onChange(e.target.value, key)}
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
             getUploadMediaOptions={getUploadMediaOptions}
             images={images}
             onClick={onCoverImageChange}
             mediaProvider={mediaProvider}
             selection={thumbnailUploadSelection}
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
  onChange: PropTypes.func,
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
