// @flow
import React from 'react'
import propTypes from 'prop-types'
import Layout from '../Layout'
import CreatePost from '../../components/CreatePost'
import DashboardTable from '../../components/DashboardTable'
import { withRouter } from 'react-router-dom'
import DashboardToolbar from '../../components/DashboardToolbar'
import DashboardWithData from './DashboardWithData'
import debounce from 'lodash.debounce'
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
        deletePost={this.props.deletePost}
        handleChange={this.handleChange}
        handleSearch={this.handleSearch}
        selected={this.props.selectedPosts}
        query={this.state.query}
        client={this.props.client}
        history={this.props.history}
        editorState={this.props.editorState}
        setEditorState={this.props.setEditorState}
      />
    )
  }

  render = () => {
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

export default withRouter(props => (
  <DashboardWithData
    {...props}
    render={data => (
      <Dashboard
        {...props}
        {...data}
      />
    )} />
))
