// @flow
import React from 'react'
import propTypes from 'prop-types'
import Layout from '../Layout'
import CreatePost from '../../components/CreatePost'
import DashboardTable from '../../components/DashboardTable'
import { withRouter } from 'react-router-dom'
import DashboardToolbar from '../../components/DashboardToolbar'
import DashboardWithData from './DashboardWithData'
import gql from 'graphql-tag'
import debounce from 'lodash.debounce'
import { feedQueryShape } from '../../shapes'
import { EditorState, convertFromRaw } from 'draft-js'
import { expand } from 'draft-js-compact'
import type { Raw, Client, PostsQuery, Post, SetEditorState } from '../../types'

type Props = {
  history: any,
  posts: PostsQuery,
  client: Client,
  setEditorState: SetEditorState,
  editorState: EditorState
}

type State = {
  query: string,
  raw: Raw,
  selectedPost: Post,
}

class Dashboard extends React.Component<Props, State> {
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
        selected={this.state.selectedPost}
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
        render={this.renderToolbar}
        logged={this.props.logged}
        client={this.props.client}
        selectedPost={this.state.selectedPost}
        query={this.state.query}
      >
        <div style={{ margin: '0 1em' }}>
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
            selectedPost={this.state.selectedPost}
            handlePostSelect={this.handlePostSelect}
            client={this.props.client}
          />
        </div>
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
