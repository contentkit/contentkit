import React from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/client'
import { TextField, Fade } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import { makeStyles } from '@material-ui/styles'
import { createFilterOptions } from '@material-ui/lab/Autocomplete'

import { useDeletePostTagConnectionMutation, useCreateTagMutation, useCreatePostTagConnectionMutation } from '../../graphql/mutations'
import { useTagQuery, ALL_TAGS_QUERY } from '../../graphql/queries'
import { genId } from '../../lib/util'

const useStyles = makeStyles(theme => ({
  tags: {
    width: '100%',
    display: 'flex',
    marginTop: 8,
    alignItems: 'center',
    marginBottom: 16,
    flexDirection: 'row'
  },
  tag: {
    marginRight: 5
  },
  inputWrapper: {
    width: '100%'
  },
  chip: {},
  notchedOutline: {
    borderColor: '#e2e8f0'
  },
  inputLabelRoot: {
    color: '#e2e8f0',
    '&$focused': {
      color: '#e2e8f0',
    }
  },
  inputRoot: {
    '&:hover $notchedOutline': {
      borderColor: '#fff'
    },
    '&$focused $notchedOutline': {
      borderColor: '#fff'
    },
    '&$error $notchedOutline': {
      borderColor: '#fff'
    },
    '&$disabled $notchedOutline': {
      borderColor: '#fff'
    },
    color: '#fff'
  },
  focused: {},
  error: {},
  disabled: {}
}))

type Option = {
  value: string,
  label: string,
  dirty?: boolean
}

type CreateTagInputProps = {
  classes: any,
  post: any,
  onDeleteTag: any
  onCreateTag: any,
  options: Option[]
  tags: any[],
}

const filterOptions = createFilterOptions({
  matchFrom: 'start',
  stringify: (option: Option | string) => typeof option === 'string' ? option : option.value
})


function CreateTagInput (props: CreateTagInputProps) {
  const {
    classes,
    post,
    onCreateTag,
    onDeleteTag,
    options,
    tags,
  } = props
  const [selection, setSelection] = React.useState([])
  
  const format = (option: string | Option): Option => {
    if (typeof option === 'string') {
      return { value: genId(), label: option, dirty: true }
    }

    return {
      ...option,
      dirty: false
    }
  }

  const onChange = async (evt, values) => {
    const formattedValues : Option[] = values.map(format)

    const newTags = formattedValues.map(v => v.value)
    const oldTags = selection.map(v => v.value)
    const added : Option[] = formattedValues.filter(v => !oldTags.includes(v.value))
    const removed : Option[] = selection.filter(v => !newTags.includes(v.value))
  
    setSelection(formattedValues)

    if (added.length) {
      await Promise.all(
        added.map(({ value, label, dirty }) => onCreateTag({ name: label, tagId: value }, dirty))
      )
    }

    if (removed.length) {
      await Promise.all(
        removed.map(({ value }) => onDeleteTag({ postId: post.id, tagId: value }))
      )
    }
  }

  React.useEffect(() => {
    const value = tags.map(({ tag }) => ({ value: tag.id, label: tag.name, dirty: false }))
    setSelection(value)
  }, [])

  const renderInput = params => {
    const { InputProps, InputLabelProps, ...rest } = params
    return (
      <TextField
        variant='outlined'
        label={'Tag'}
        placeholder=''
        margin='dense'
        InputLabelProps={{
          ...InputLabelProps,
          classes: {
            ...InputLabelProps.classes,
            root: classes.inputLabelRoot,
            focused: classes.focused
          }
        }}
        InputProps={{
          ...InputProps,
          classes: {
            ...InputProps.classes,
            root: classes.inputRoot,
            notchedOutline: classes.notchedOutline,
            focused: classes.focused,
            error: classes.error,
            disabled: classes.disabled
          }
        }}
        {...rest}
      />
    )
  }

  const getOptionLabel = (option: Option | string) => typeof option === 'string' ? option : option.label

  return (
    <div className={classes.inputWrapper}>
      <Autocomplete
        renderInput={renderInput}
        multiple
        getOptionLabel={getOptionLabel}
        filterSelectedOptions
        filterOptions={filterOptions}
        options={options}
        onChange={onChange}
        value={selection}
        freeSolo
      />
    </div>
  )
}

CreateTagInput.defaultProps = {
  options: [],
  tags: []
}

CreateTagInput.propTypes = {
  createTag: PropTypes.func.isRequired
}

function PostTagChips (props) {
  const { post, users } = props
  const classes = useStyles(props)
  const tagQuery = useTagQuery({ variables: { postId: post.id } })
  const allTagsQuery = useQuery(ALL_TAGS_QUERY, {
    variables: {
      userId: users.data.users[0].id
    }
  })
  const createTag = useCreateTagMutation()
  const deleteTag = useDeletePostTagConnectionMutation()
  const createPostTagConnection = useCreatePostTagConnectionMutation()

  const onCreateTag = (variables: { name: string, tagId: string }, dirty: boolean) => {
    if (!dirty) {
      return createPostTagConnection({
        postId: post.id,
        tagId: variables.tagId
      })
    }

    return createTag({
      ...variables,
      projectId: post.project.id,
      postId: post.id,
      userId: users.data.users[0].id
    })
  }

  const tags = tagQuery?.data?.posts_tags || []

  const options = React.useMemo(() => {
    return (allTagsQuery?.data?.tags || []).map(tag => ({
      value: tag.id,
      label: tag.name
    }))
  }, [allTagsQuery])

  if (!post?.id) {
    return null
  }

  return (
    <Fade in={!tagQuery.loading} mountOnEnter unmountOnExit>
      <CreateTagInput
        post={post}
        classes={{
          inputWrapper: classes.inputWrapper,
          inputRoot: classes.inputRoot,
          notchedOutline: classes.notchedOutline,
          focused: classes.focused,
          error: classes.error,
          disabled: classes.disabled,
          inputLabelRoot: classes.inputLabelRoot
        }}
        options={options}
        tags={tags}
        onCreateTag={onCreateTag}
        onDeleteTag={deleteTag}
      />
    </Fade>
  )
}

export default PostTagChips
