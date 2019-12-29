import React from 'react'
import PropTypes from 'prop-types'
import { DELETE_TAG, CREATE_TAG, CREATE_POST_TAG_CONNECTION, useDeleteTagMutation, useCreateTagMutation } from '../../graphql/mutations'
import { TAG_QUERY, POST_QUERY } from '../../graphql/queries'
import { genKey, genDate } from '../../lib/util'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { Input, Chip } from '@contentkit/components'
import { withStyles } from '@material-ui/styles'

const styles = theme => ({
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
  }
})

function CreateTagInput (props) {
  const { classes } = props
  const [value, setValue] = React.useState('')

  const handleChange = evt => {
    setValue(evt.target.value)
  }

  const onKeyDown = evt => {
    if (evt.key === 'Enter') {
      const { post, createTag } = props
      createTag({
        name: value,
        projectId: post.project.id,
        postId: post.id,
        userId: props.users.data.users[0].id,
        tagId: [...Array(20)].map(i=>(~~(Math.random()*36)).toString(36)).join('')
      })
    }
  }

  return (
    <div className={classes.inputWrapper}>
      <Input
        value={value}
        placeholder={'Create tag'}
        onChange={handleChange}
        onKeyDown={onKeyDown}
      />
    </div>
  )
}

CreateTagInput.propTypes = {
  createTag: PropTypes.func.isRequired
}

function PostTagChips (props) {
  const { classes, post, users } = props

  const tagQuery = useQuery(TAG_QUERY, { variables: { postId: post.id } })
  const createTag = useCreateTagMutation()
  const deleteTag = useDeleteTagMutation()

  if (!post?.id) {
    return false
  }

  if (tagQuery.loading) {
    return false
  }

  return (
    <div>
      <div className={styles.tags}>
        {tagQuery.data.posts_tags.map(({ tag }) => (
          <Chip
            key={tag.id}
            onDelete={() => deleteTag({
              tagId: tag.id,
              postId: post.id
            })}
            className={styles.chip}
            label={tag.name}
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

export default withStyles(styles)(PostTagChips)
