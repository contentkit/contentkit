import React from 'react'
import PropTypes from 'prop-types'
import { useDeleteTagMutation, useCreateTagMutation } from '../../graphql/mutations'
import { useTagQuery } from '../../graphql/queries'
import { genKey, genDate } from '../../lib/util'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { Input, Chip } from '@contentkit/components'
import { makeStyles } from '@material-ui/styles'

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

type CreateTagInputProps = {
  users: any,
  classes: any,
  post: any,
  createTag: any
}

function CreateTagInput (props: CreateTagInputProps) {
  const {
    classes,
    post,
    users,
    createTag
  } = props
  const [value, setValue] = React.useState('')

  const onChange = evt => {
    setValue(evt.target.value)
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

  return (
    <div className={classes.inputWrapper}>
      <Input
        value={value}
        placeholder={'Create tag'}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    </div>
  )
}

CreateTagInput.propTypes = {
  createTag: PropTypes.func.isRequired
}

function PostTagChips (props) {
  const { post, users } = props
  const classes = useStyles(props)
  const tagQuery = useTagQuery({ variables: { postId: post.id } })
  const createTag = useCreateTagMutation()
  const deleteTag = useDeleteTagMutation()

  if (!post?.id) {
    return false
  }

  if (tagQuery.loading) {
    return false
  }

  const createDeleteHandler = (tag) => () => {
    deleteTag({
      tagId: tag.id,
      postId: post.id
    })
  }

  return (
    <div>
      <div className={classes.tags}>
        {tagQuery.data.posts_tags.map(({ tag }) => (
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
      />
    </div>
  )
}

export default PostTagChips
