import React from 'react'
import PropTypes from 'prop-types'
import { Chip } from '@material-ui/core'
import { DELETE_TAG, CREATE_TAG } from '../../graphql/mutations'
import { TAG_QUERY } from '../../graphql/queries'
import { Mutation, Query } from 'react-apollo'
import TextField from '@material-ui/core/TextField'
import { withStyles } from '@material-ui/core/styles'
import { genKey, genDate } from '../../lib/util'

class CreateTagInput extends React.Component {
  static PropTypes = {
    createTag: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
  }

  state = {
    value: ''
  }

  handleChange = evt => {
    this.setState({ value: evt.target.value })
  }

  onKeyDown = evt => {
    if (evt.key === 'Enter') {
      const { value } = this.state
      const { post } = this.props
      this.props.createTag({ 
        name: value,
        projectId: post.project.id,
        postId: post.id
      })
    }
  }

  render () {
    const { classes } = this.props
    return (
      <div className={classes.inputWrapper}>
        <TextField
          value={this.state.value}
          placeholder={'Create tag'}
          onChange={this.handleChange}
          onKeyDown={this.onKeyDown}
          variant={'outlined'}
          margin={'normal'}
          fullWidth
        />
      </div>
    )
  }
}

class PostTagChips extends React.Component {
  static PropTypes = {
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
    const { classes } = this.props
    const post = this.props.post?.data?.post
    if (!post?.id) return false
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
                      <div className={classes.tags}>
                        {tagQuery.data.tagsByPost.map(tag => (
                          <Chip
                            key={tag.id}
                            label={tag.name}
                            onDelete={() => this.deleteTag({
                              query: tagQuery,
                              mutate: deleteTag,
                              variables: { id: tag.id }
                            })}
                            className={classes.chip}
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

const styles = {
  tags: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
    marginBottom: 16
  },
  inputWrapper: {
    width: '100%',
    // display: 'flex',
    // flexDirection: 'column',
    // alignItems: 'center',
    // justifyContent: 'center'
  }
}

export default withStyles(styles)(PostTagChips)
