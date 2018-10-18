// @flow
import React from 'react'
import { Query } from 'react-apollo'

import { FEED_QUERY, PROJECTS_QUERY } from '../../graphql/queries'
import { DELETE_POST } from '../../graphql/mutations'

import debounce from 'lodash.debounce'
import { connect } from 'react-redux'
import { selectProject, setEditorState } from '../../lib/redux'
import PropTypes from 'prop-types'
import type { SetEditorState, Project, Client } from '../../types'
import type { EditorState } from 'draft-js'

type Props = {
  setEditorState: SetEditorState,
  selectedProject: Project,
  client: Client,
  selectProject: (project: Project) => void,
  render: (args: any) => void
}

type State = {
  variables: {
    before: string,
    after: string,
    first: number,
    query: string,
    id: string,
    projectId: string,
    skip: number
  }
}

const deletePost = feed => ({ id }) => {
  feed.client.mutate({
    mutation: DELETE_POST,
    variables: { id }
  })
  return feed.client.cache.writeQuery({
    query: FEED_QUERY,
    data: {
      feed: {
        ...feed.data.feed,
        posts: feed.data.feed.posts.filter((post) => post.id !== id)
      }
    },
    variables: feed.variables
  })
}

class DashboardWithData extends React.Component<Props, State> {
  static propTypes = {
    user: PropTypes.object,
    selectedProject: PropTypes.string,
    setEditorState: PropTypes.func,
    selectProject: PropTypes.func,
    client: PropTypes.object,
    render: PropTypes.func
  }

  state = {
    variables: {
      limit: 10,
      offset: 0,
      query: '',
      projectId: undefined
    }
  }

  handleSearch = debounce(({ query }: { query: string }) => {
    this.setState({ query })
  }, 300)

  updateVariables = variables => {
    window.requestIdleCallback(() =>
      this.setState(prevState => ({
        variables: {
          ...prevState.variables,
          ...(variables || {})
        }
      }))
    )
  }

  render () {
    const { user } = this.props
    const variables = {
      ...this.state.variables,
      projectId: this.props.selectedProject
    }
    return (
      <Query query={FEED_QUERY} variables={variables}>
        {(feed) => {
          //if (!(feed.data && feed.data.feed)) {
          //  return null
          //}
          return (
            <Query query={PROJECTS_QUERY}>
              {(projects) => {
                //if (!(projects.data && projects.data.allProjects)) {
                // return null
                //}
                return this.props.render({
                  editorState: this.props.editorState,
                  setEditorState: this.props.setEditorState,
                  selectProject: this.props.selectProject,
                  selectedProject: this.props.selectedProject,
                  updateVariables: this.updateVariables,
                  variables: variables,
                  handleSearch: this.handleSearch,
                  feed: feed,
                  projects: projects,
                  deletePost: deletePost(feed)
                })
              }}
            </Query>
          )
        }}
      </Query>
    )
  }
}

export default connect(
  state => state,
  dispatch => ({
    setEditorState: (editorState: EditorState) => dispatch(setEditorState(editorState): any),
    selectProject: (project: Project) => dispatch(selectProject(project): any)
  })
)(DashboardWithData)
