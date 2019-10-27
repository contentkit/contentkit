import React from 'react'
import PropTypes from 'prop-types'
import { DELETE_TAG, CREATE_TAG } from '../../graphql/mutations'
import { TAG_QUERY } from '../../graphql/queries'
import { Mutation, Query } from 'react-apollo'
import { genKey, genDate } from '../../lib/util'
import Chip from '../Chip'
import Input from '../Input'
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
        postId: post.id
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
            ...variables
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

  createTag = ({ mutate, query }) => variables =>
    mutate({
      variables,
      optimisticResponse: {
        __typename: 'Mutation',
        insert_tags: {
          __typename: 'tags_mutation_response',
          returning: {
            __typename: 'Tag',
            id: genKey(),
            name: variables.name,
            description: null,
            createdAt: genDate(),
            slug: null
          }
        }
      },
      update: (store, { data: { insert_tags } }) => {
        store.writeQuery({
          query: TAG_QUERY,
          data: {
            posts_tags: query.data.posts_tags.concat(insert_tags.returning[0])
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
                        {tagQuery.data.posts_tags.map(({ tag }) => (
                          <Chip
                            key={tag.id}
                            onDelete={() => this.deleteTag({
                              query: tagQuery,
                              mutate: deleteTag,
                              variables: { id: tag.id }
                            })}
                            className={styles.chip}
                            label={tag.name}
                          />
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

export default withStyles(styles)(PostTagChips)

