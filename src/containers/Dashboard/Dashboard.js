import React from 'react'
import propTypes from 'prop-types'
import debounce from 'lodash.debounce'
import { withRouter } from 'react-router-dom'
import { compose, withApollo } from 'react-apollo'
import { connect } from 'react-redux'
import Layout from '../Layout'
import DashboardTable from '../../components/DashboardTable'
import DashboardToolbar from '../../components/DashboardToolbar'
import withData from './withData'
import { selectProject, selectPosts, setEditorState, setSearchQuery, setSearchLoadingState, updateFeedVariables } from '../../lib/redux'
import CreatePostModal from '../../components/CreatePostModal'

import { feedQueryShape } from '../../shapes'
import { ObservableQuery } from 'apollo-client'
import { EditorState } from 'draft-js'

// type Posts = {
//   variables: any,
//   data: {
    
//   }
// }

// type DashboardProps = any & {
//   posts: Posts,
//   setSearchLoadingState: SetSearchLoadingState,
//   selectProject: SelectProject,
//   setSearchQuery: () => void,
//   postsAggregateVariables: PostsAggregateVariables,
//   editorState: EditorState,
//   setEditorState: SetEditorState,
//   logged: boolean
// }

// type DashboardState = {
//   modalOpen: boolean,
//   query: string
// }

class Dashboard extends React.Component {
  static defaultProps = {
    project: {},
    selected: undefined,
  }

  static propTypes = {
    history: propTypes.object.isRequired,
    posts: feedQueryShape.isRequired
  }

  static displayName = 'Dashboard'

  state = {
    query: '',
    modalOpen: false
  }

  handleProjectSelect = (selectedProject) => {
    this.updateVariables({
      projectId: selectedProject
    })
  }

  handleSearch = ({ query }) => {
    this.updateVariables({ query })
  }

  debouncedSearch = debounce(this.handleSearch, 1000)

  updateVariables = (variables) => {
    const query = variables.query || ''
    this.props.posts.fetchMore({
      variables: {
        ...this.props.posts.variables,
        ...variables,
        query: query ? `%${query}%` : '%'
      },
      updateQuery: (_, { fetchMoreResult }) => {
        return fetchMoreResult
      }
    }).then(() => {
      this.props.setSearchLoadingState(false)
    })
  }

  handleModalOpen = () => {
    this.setState({ modalOpen: true })
  }

  handleModalClose = () => {
    this.setState({ modalOpen: false })
  }

  getToolbarProps = () => {
    return {
      setSearchQuery: this.props.setSearchQuery,
      handleSearch: this.debouncedSearch,
      selected: this.props.selectedPosts,
      search: this.props.search,
      client: this.props.client,
      history: this.props.history,
      editorState: this.props.editorState,
      setEditorState: this.props.setEditorState,
      posts: this.props.posts,
      selectedProject: this.props.postsAggregateVariables.projectId,
      projects: this.props.projects,
      selectProject: this.props.selectProject,
      handleOpen: this.handleModalOpen,
      users: this.props.users
    }
  }

  render () {
    return (
      <Layout
        history={this.props.history}
        render={() => null}
        logged={this.props.logged}
        client={this.props.client}
        selectedPosts={this.props.selectedPosts}
        query={this.state.query}
      >
        <CreatePostModal
          posts={this.props.posts}
          selectedProject={this.props.postsAggregateVariables.projectId}
          projects={this.props.projects}
          selectProject={this.props.selectProject}
          client={this.props.client}
          open={this.state.modalOpen}
          handleClose={this.handleModalClose}
          users={this.props.users}
        />
        <DashboardTable
          posts={this.props.posts}
          projects={this.props.projects}
          selectPosts={this.props.selectPosts}
          selectedPosts={this.props.selectedPosts}
          client={this.props.client}
          renderToolbar={this.renderToolbar}
          search={this.props.search}
          history={this.props.history}
          getToolbarProps={this.getToolbarProps}
        />
      </Layout>
    )
  }
}

export default compose(
  withRouter,
  withApollo,
  connect(
    state => state.app,
    {
      setEditorState,
      selectProject,
      selectPosts,
      setSearchQuery,
      setSearchLoadingState,
      updateFeedVariables
    }
  ),
  withData
)(Dashboard)
