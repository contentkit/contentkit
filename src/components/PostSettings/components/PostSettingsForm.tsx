import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import safeKey from 'safe-s3-key'
import { useQuery } from '@apollo/client'
import { ThumbnailUpload } from '@contentkit/components'
import { OutlinedInput, Box, Grid } from '@material-ui/core'
import { Add } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'

import PostStatusSelect from '../../PostEditorMetaModalSelect'
import ProjectSelect from '../../ProjectSelect'
import PostMetaDatePicker from '../../PostEditorMetaModalDatePicker'
import TagManager from './TagManager'
import FormInput from '../../FormInput'


const useStyles = makeStyles((theme: any) => ({
  root: {
    width: '100%'
  },
  thumbnail: {
    width: '100%',
    height: '100%'
  },
  selected: {
    backgroundColor: 'green'
  },
  gutter: {
    marginBottom: theme.spacing(2)
  },
  notchedOutline: {
    borderColor: '#e2e8f0'
  },
  selectIcon: {
    color: '#e2e8f0'
  },
  inputRoot: {
    color: '#fff',
    '&:hover $notchedOutline,&$focused $notchedOutline': {
      borderColor: '#e2e8f0'
    }
  }
}))

enum FieldType {
  FORM_INPUT = 'form_input',
  FORM_SELECT = 'form_select',
  CUSTOM = 'custom'
}

function PostSettingsForm (props) {
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
        fullWidth: true,
        onChange,
        value: post.status,
        input: (<OutlinedInput margin='dense' classes={{ notchedOutline: classes.notchedOutline, root: classes.inputRoot }} />),
        classes: {
          icon: classes.selectIcon
        }
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
        fullWidth: true,
        onChange: selectProject,
        input: (<OutlinedInput margin='dense' classes={{ notchedOutline: classes.notchedOutline, root: classes.inputRoot }} />)
        classes: {
          icon: classes.selectIcon
        }
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
        value: post.published_at
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
        <Component {...getComponentProps()} key={key} />
      )
    }
  })

  return (
    <form className={classes.root}>
      {
        children.map(component => {
          return (
            <Box mb={3}>{component}</Box>
          )
        })
      }
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
          <TagManager post={post} users={users} />
        </Grid>
      </Grid>
    </form>
  )
}

PostSettingsForm.propTypes = {
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
    <PostSettingsForm {...props} projects={projects} /> 
  )
}

export default MetaModalWithQuery
