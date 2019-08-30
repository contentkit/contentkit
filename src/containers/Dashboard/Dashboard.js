// @flow
import React from 'react'
import propTypes from 'prop-types'
import debounce from 'lodash.debounce'
import { withRouter } from 'react-router-dom'
import { compose, withApollo } from 'react-apollo'
import { connect } from 'react-redux'
import Layout from '../Layout'
import CreatePost from '../../components/CreatePost'
import DashboardTable from '../../components/DashboardTable'
import DashboardToolbar from '../../components/DashboardToolbar'
import withData from './withData'
import { selectProject, selectPosts, setEditorState, setSearchQuery, setSearchLoadingState, updateFeedVariables } from '../../lib/redux'
import CreatePostModal from '../../components/CreatePostModal'

import { feedQueryShape } from '../../shapes'

class Dashboard extends React.Component {
  static defaultProps = {
    project: {},
    selected: undefined,
  }

  static propTypes = {
    history: propTypes.object.isRequired,
    feed: feedQueryShape.isRequired
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
    this.props.feed.fetchMore({
      variables: {
        ...this.props.feed.variables,
        ...variables
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

  renderToolbar = () => {
    return (
      <DashboardToolbar
        setSearchQuery={this.props.setSearchQuery}
        handleSearch={this.debouncedSearch}
        selected={this.props.selectedPosts}
        search={this.props.search}
        client={this.props.client}
        history={this.props.history}
        editorState={this.props.editorState}
        setEditorState={this.props.setEditorState}
        feed={this.props.feed}
        selectedProject={this.props.feedVariables.projectId}
        projects={this.props.projects}
        selectProject={this.props.selectProject}
        handleOpen={this.handleModalOpen}
      />
    )
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
          feed={this.props.feed}
          selectedProject={this.props.feedVariables.projectId}
          projects={this.props.projects}
          selectProject={this.props.selectProject}
          client={this.props.client}
          open={this.state.modalOpen}
          handleClose={this.handleModalClose}
        />

        {/* <CreatePost
          feed={this.props.feed}
          selectedProject={this.props.feedVariables.projectId}
          projects={this.props.projects}
          selectProject={this.props.selectProject}
          client={this.props.client}
        /> */}
        <DashboardTable
          feed={this.props.feed}
          projects={this.props.projects}
          selectPosts={this.props.selectPosts}
          selectedPosts={this.props.selectedPosts}
          client={this.props.client}
          renderToolbar={this.renderToolbar}
          search={this.props.search}
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
