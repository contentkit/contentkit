import React from 'react'
import PropTypes from 'prop-types'
import { DELETE_TAG, CREATE_TAG } from '../../graphql/mutations'
import { TAG_QUERY } from '../../graphql/queries'
import { Mutation, Query } from 'react-apollo'
import { genKey, genDate } from '../../lib/util'
import Tag from 'antd/lib/tag'
import styles from './styles.scss'
import Input from 'antd/lib/input'

function CreateTagInput (props) {
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
        postId: post.id
      })
    }
  }

  const { classes } = props
  return (
    <div className={styles.inputWrapper}>
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

class PostTagChips extends React.Component {
  static propTypes = {
    post: PropTypes.object.isRequired
  }

  deleteTag = ({ mutate, variables, query }) =>
    mutate({
      variables,
      optimisticResponse: {
        __typename: 'Mutation',
        deleteTag: {
          __typename: 'Tag',
          ...variables
        }
      },
      update: (store, { data: { deleteTag } }) => {
        store.writeQuery({
          query: TAG_QUERY,
          data: {
            tagsByPost: query.data.tagsByPost.filter(c => c.id !== deleteTag.id)
          },
          variables: query.variables
        })
      }
    })

  createTag = ({ mutate, query }) => variables =>
    mutate({
      variables,
      optimisticResponse: {
        __typename: 'Mutation',
        createTag: {
          __typename: 'Tag',
          id: genKey(),
          name: variables.name,
          description: null,
          createdAt: genDate(),
          slug: null
        }
      },
      update: (store, { data: { createTag } }) => {
        store.writeQuery({
          query: TAG_QUERY,
          data: {
            tagsByPost: query.data.tagsByPost.concat(createTag)
          },
          variables: query.variables
        })
      }
    })

  render () {
    const { classes, post } = this.props
    if (!post?.id) {
      return false
    }
    return (
      <Query query={TAG_QUERY} variables={{ postId: post.id }}>
        {tagQuery => (
          <Mutation mutation={DELETE_TAG}>
            {deleteTag => (
              <Mutation mutation={CREATE_TAG}>
                {createTag => {
                  if (tagQuery.loading) return false
                  return (
                    <div>
                      <div className={styles.tags}>
                        {tagQuery.data.tagsByPost.map(tag => (
                          <Tag
                            closable
                            visible
                            key={tag.id}
                            onClose={() => this.deleteTag({
                              query: tagQuery,
                              mutate: deleteTag,
                              variables: { id: tag.id }
                            })}
                            className={styles.chip}
                          >{tag.name}</Tag>
                        ))}
                      </div>
                      <CreateTagInput
                        post={post}
                        classes={classes}
                        createTag={this.createTag({ mutate: createTag, query: tagQuery })}
                      />
                    </div>
                  )
                }}
              </Mutation>
            )}
          </Mutation>
        )}
      </Query>
    )
  }
}

export default PostTagChips
