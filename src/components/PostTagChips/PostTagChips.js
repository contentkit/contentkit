import React from 'react'
import PropTypes from 'prop-types'
import { DELETE_TAG, CREATE_TAG, CREATE_POST_TAG_CONNECTION } from '../../graphql/mutations'
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




function useDeleteTag () {
  const [deleteTagMutation, deleteTagData] = useMutation(DELETE_TAG)
  const deleteTag = (variables) => deleteTagMutation({
    variables,
    optimisticResponse: {
      __typename: 'Mutation',
      delete_tags: {
        __typename: 'tags_mutation_response',
        returning: [{
          __typename: 'Tag',
          id: variables.tagId
        }]
      }
    },
    update: (store, { data: { delete_tags } }) => {
      const query = store.readQuery({
        query: TAG_QUERY,
        variables: { id: variables.tagId }
      })
      store.writeQuery({
        query: TAG_QUERY,
        data: {
          posts_tags: query.posts_tags.filter(c => c.tag.id !== delete_tags.returning[0].id)
        },
        variables: query.variables
      })
    }
  })

  return deleteTag
}

function useCreateTag () {
  const [createTagMutation, createTagData] = useMutation(CREATE_TAG)
  const createTag = async (variables) => {
    const tagId = genKey()
    return mutate({
      variables,
      optimisticResponse: {
        __typename: 'Mutation',
        insert_tags: {
          __typename: 'tags_mutation_response',
          returning: [{
            __typename: 'tags',
            id: tagId,
            name: variables.name,
            description: null,
            created_at: genDate(),
            slug: null
          }]
        },
        insert_posts_tags: {
          __typename: 'posts_tags_mutation_response',
          returning: [{
            __typename: 'posts_tags',
            post_id: variables.postId,
            tag_id: tagId
          }]
        }
      },
      update: (store, { data: { insert_tags } }) => {
        const { post_tags } = store.readQuery({
          query: TAG_QUERY,
          variables: { postId: variables.postId }
        })
        store.writeQuery({
          query: TAG_QUERY,
          data: {
            posts_tags: posts_tags.concat(insert_tags.returning.map(tag => ({ tag })))
          },
          variables: { postId: variables.postId }
        })
      }
    })
  }

  return createTag
}

function PostTagChips (props) {
  const { classes, post, users } = props

  const tagQuery = useQuery(TAG_QUERY, { variables: { postId: post.id } })
  const createTag = useCreateTag()
  const deleteTag = useDeleteTag()

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
              query: tagQuery,
              mutate: deleteTag,
              variables: {
                tagId: tag.id,
                postId: post.id
              }
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
