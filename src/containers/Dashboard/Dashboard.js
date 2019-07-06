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
import { selectProject, selectPosts, setEditorState } from '../../lib/redux'

import { feedQueryShape } from '../../shapes'

class Dashboard extends React.Component {
  static defaultProps = {
    project: {},
    selected: undefined
  }

  static propTypes = {
    history: propTypes.object.isRequired,
    feed: feedQueryShape.isRequired
  }

  static displayName = 'Dashboard'

  state = {
    query: '',
    selectedPost: undefined
  }

  handleProjectSelect = (selectedProject) => {
    this.props.updateVariables({
      project: selectedProject
    })
  }

  handlePostSelect = (selectedPost) => {
    this.setState(prevState => {
      if (
        prevState.selectedPost &&
        prevState.selectedPost.id === selectedPost.id
      ) {
        return { selectedPost: undefined }
      }
      return { selectedPost }
    })
  }

  handleChange = ({ currentTarget }) => {
    const { value: query } = currentTarget
    this.setState({ query })
  }

  handleSearch = debounce(({ query }) => this.updateVariables({ query }), 1000)

  updateVariables = (variables) => {
    this.props.feed.fetchMore({
      variables: {
        ...this.props.variables,
        ...variables
      },
      updateQuery: (_, { fetchMoreResult }) => {
        return fetchMoreResult
      }
    })
  }

  renderToolbar = () => {
    return (
      <DashboardToolbar
        handleChange={this.handleChange}
        handleSearch={this.handleSearch}
        selected={this.props.selectedPosts}
        query={this.state.query}
        client={this.props.client}
        history={this.props.history}
        editorState={this.props.editorState}
        setEditorState={this.props.setEditorState}
        feed={this.props.feed}
      />
    )
  }

  render () {
    console.log(this.props)
    return (
      <Layout
        history={this.props.history}
        render={() => null}
        logged={this.props.logged}
        client={this.props.client}
        selectedPosts={this.props.selectedPosts}
        query={this.state.query}
      >
        <article>
          <CreatePost
            feed={this.props.feed}
            selectedProject={this.props.selectedProject}
            projects={this.props.projects}
            selectProject={this.props.selectProject}
            client={this.props.client}
          />
          <DashboardTable
            feed={this.props.feed}
            projects={this.props.projects}
            selectPosts={this.props.selectPosts}
            selectedPosts={this.props.selectedPosts}
            client={this.props.client}
            renderToolbar={this.renderToolbar}
          />
        </article>
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
      selectPosts
    }
  ),
  withData
)(Dashboard)
