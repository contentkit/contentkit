import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import safeKey from 'safe-s3-key'
import { useQuery } from '@apollo/client'
import { ThumbnailUpload } from '@contentkit/components'
import { Grid, FormControl, InputLabel } from '@material-ui/core'
import { Add } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import chunk from 'lodash.chunk'

import PostStatusSelect from '../PostEditorMetaModalSelect'
import ProjectSelect from '../ProjectSelect'
import PostMetaDatePicker from '../PostEditorMetaModalDatePicker'
import PostTagChips from '../PostTagChips'
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
        allProjects,
        selectedProjectId: selectedProject,
        setSelectedProjectId: selectProject
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
    }
  ]

  const thumbnailUploadSelection = post?.cover_image_id
    ? [post.cover_image_id]
    : []

  const children = fields.map(({ label, key, type, Component, getComponentProps }) => {
    if (type === FieldType.FORM_INPUT) {
      return (
        <FormInput
          key={key}
          label={label}
          onChange={e => onChange(e.target.value, key)}
          value={post[key]}
          fullWidth
        />
      )
    }

    if (type === FieldType.FORM_SELECT) {
      return (
        <FormControl fullWidth key={key}>
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
