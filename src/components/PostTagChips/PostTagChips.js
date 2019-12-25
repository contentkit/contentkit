import React from 'react'
import PropTypes from 'prop-types'
import { DELETE_TAG, CREATE_TAG, CREATE_POST_TAG_CONNECTION } from '../../graphql/mutations'
import { TAG_QUERY, POST_QUERY } from '../../graphql/queries'
import { Mutation, Query } from 'react-apollo'
import { genKey, genDate } from '../../lib/util'
import { Input, Chip } from '@contentkit/components'
import { withStyles } from '@material-ui/styles'
import { withApollo, compose } from 'react-apollo'

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

class PostTagChips extends React.Component {
  static propTypes = {
    post: PropTypes.object.isRequired
  }

  deleteTag = ({ mutate, variables, query }) =>
    mutate({
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
        store.writeQuery({
          query: TAG_QUERY,
          data: {
            posts_tags: query.data.posts_tags.filter(c => c.tag.id !== delete_tags.returning[0].id)
          },
          variables: query.variables
        })
      }
    })

  createTag = ({ mutate, query }) => async (variables) => {
    const tagId = genKey()
    const data = await mutate({
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
        store.writeQuery({
          query: TAG_QUERY,
          data: {
            posts_tags: query.data.posts_tags.concat(insert_tags.returning.map(tag => ({ tag })))
          },
          variables: query.variables
        })
      }
    })
    return data

    // this.props.client.mutate({
    //   mutation: CREATE_POST_TAG_CONNECTION,
    //   variables: {
    //     post_id: postId,
    //     tag_id: data.insert_tags.returning[0].id
    //   },
    //   optimisticResponse: {
    //     __typename: 'Mutation',
    //     insert_posts_tags: {
    //       __typename: 'posts_tags_mutation_response',
    //       returning: [{
    //         __typename: 'PostsTags',
    //         post_id: postId,
    //         tag_id: data.insert_tags.returning[0].id
    //       }]
    //     }
    //   },
    //   update: (store, { data: { insert_posts_tags } }) => {
    //     const { variables: params, data: { posts } } = this.props.post
    //     store.writeQuery({
    //       query: POST_QUERY,
    //       variables: params,
    //       data: {
    //         posts: [{
    //           ...posts[0],
    //           posts_tags: posts[0].post_tags.concat([{ tag: data.insert_tags.returning[0] }])
    //         }]
    //       }
    //     })
    //   }
    // })
  }

  render () {
    const { classes, post, users } = this.props
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
                        {tagQuery.data.posts_tags.map(({ tag }) => (
                          <Chip
                            key={tag.id}
                            onDelete={() => this.deleteTag({
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

export default compose(
  withApollo,
  withStyles(styles)
)(PostTagChips)

