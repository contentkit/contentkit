// @flow
import React from 'react'
import { unstable_deferredUpdates as deferredUpdates } from 'react-dom'
import { Query } from 'react-apollo'
import { POSTS_QUERY, PROJECTS_QUERY } from './queries'
import { deletePostAndReferences } from './deletePostAndReferences'
import debounce from 'lodash.debounce'
import { connect } from 'react-redux'
import { selectProject, setEditorState } from '../../lib/redux'
import PropTypes from 'prop-types'
import type { SetEditorState, Project, Client } from '../../types'
import type { EditorState } from 'draft-js'

let count = Math.round((window.innerHeight - 230) / 50)

type Props = {
  auth: {
    user: {
      id: string
    }
  },
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

class DashboardQueries extends React.Component<Props, State> {
  static propTypes = {
    auth: PropTypes.object,
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
    deferredUpdates(() =>
      this.setState(prevState => ({
        variables: {
          ...prevState.variables,
          ...(variables || {})
        }
      }))
    )
  }

  render () {
    const { auth } = this.props
    if (!(auth && auth.user)) return null
    const variables = {
      ...this.state.variables,
      projectId: this.props.selectedProject,
    }
    return (
      <Query query={POSTS_QUERY} variables={variables}>
        {(posts) => {
          if (!(posts.data && posts.data.allPosts)) {
            return null
          }
          return (
            <Query query={PROJECTS_QUERY}>
              {(projects) => {
                if (!(projects.data && projects.data.allProjects)) {
                  return null
                }
                return this.props.render({
                  editorState: this.props.editorState,
                  setEditorState: this.props.setEditorState,
                  selectProject: this.props.selectProject,
                  selectedProject: this.props.selectedProject,
                  updateVariables: this.updateVariables,
                  variables: variables,
                  handleSearch: this.handleSearch,
                  posts: posts,
                  projects: projects,
                  deletePost: deletePostAndReferences({
                    posts,
                    client: this.props.client
                  })
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
)(DashboardQueries)
