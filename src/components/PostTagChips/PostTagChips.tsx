import React from 'react'
import PropTypes from 'prop-types'

import { useQuery } from '@apollo/client'
import { useDeleteTagMutation, useCreateTagMutation } from '../../graphql/mutations'

import { useTagQuery, ALL_TAGS_QUERY } from '../../graphql/queries'
import { TextField } from '@material-ui/core'
import { Input, Chip } from '@contentkit/components'
import { Autocomplete } from '@material-ui/lab'
import { makeStyles } from '@material-ui/styles'
import { createFilterOptions } from '@material-ui/lab/Autocomplete'

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
  chip: {}
}))

type Option = {
  value: string,
  label: string
}

type CreateTagInputProps = {
  users: any,
  classes: any,
  post: any,
  createTag: any,
  options: Option[]
}

const filterOptions = createFilterOptions({
  matchFrom: 'start',
  stringify: (option: Option | string) => typeof option === 'string' ? option : option.value
})


function CreateTagInput (props: CreateTagInputProps) {
  const {
    classes,
    post,
    users,
    createTag,
    options,
  } = props
  const [value, setValue] = React.useState([])

  const onChange = (evt, values) => {
    setValue(values)
  }

  const onKeyDown = evt => {
    if (evt.key === 'Enter') {
      createTag({
        name: value,
        projectId: post.project.id,
        postId: post.id,
        userId: users.data.users[0].id,
        tagId: [...Array(20)].map(i=>(~~(Math.random()*36)).toString(36)).join('')
      })
    }
  }

  const renderInput = params => (
    <TextField
      {...params}
      variant='outlined'
      label={'Tag'}
      placeholder=''
      margin='dense'
    />
  )

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
        value={value}
        // value={value}
        // placeholder={'Create tag'}
        // onChange={onChange}
        // onKeyDown={onKeyDown}
      />
    </div>
  )
}

CreateTagInput.defaultProps = {
  options: []
}

CreateTagInput.propTypes = {
  createTag: PropTypes.func.isRequired
}

function PostTagChips (props) {
  const { post, users } = props
  const classes = useStyles(props)
  const tagQuery = useTagQuery({ variables: { postId: post.id } })
  const allTagsQuery = useQuery(ALL_TAGS_QUERY)
  console.log(allTagsQuery)
  const createTag = useCreateTagMutation()
  const deleteTag = useDeleteTagMutation()

  if (!post?.id) {
    return null
  }

  const createDeleteHandler = (tag) => () => {
    deleteTag({
      tagId: tag.id,
      postId: post.id
    })
  }

  const tags = tagQuery?.data?.posts_tags || []
  const options = React.useMemo(() => {
    return (allTagsQuery?.data?.tags || []).map(tag => ({
      value: tag.id,
      label: tag.name
    }))
  }, [allTagsQuery])
  return (
    <div>
      <div className={classes.tags}>
        {tags.map(({ tag }) => (
          <Chip
            key={tag.id}
            onDelete={createDeleteHandler(tag)}
            className={classes.chip}
            label={tag.name}
            classes={classes}
          />
        ))}
      </div>
      <CreateTagInput
        users={users}
        post={post}
        classes={classes}
        createTag={createTag}
        options={options}
      />
    </div>
  )
}

export default PostTagChips
