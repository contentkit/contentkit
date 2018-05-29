// @flow
import React from 'react'
import propTypes from 'prop-types'
import Layout from '../Layout'
import CreatePost from './components/CreatePost'
import AdminTable from './components/AdminTable'
import { Map } from 'immutable'
import { withRouter } from 'react-router-dom'
import AppToolbar from './components/AppToolbar'
import AppQueries from './AppQueries'
import { connect } from 'react-redux'
import { setEditorState } from '../../redux'
import { EditorState, convertFromRaw } from 'draft-js'
import * as compact from 'draft-js-compact'
import gql from 'graphql-tag'
import debounce from 'lodash.debounce'
import { posts } from '../../types/PropTypes'

class App extends React.Component<{
  history: any,
  auth: any
}> {
  static defaultProps = {
    project: {},
    selected: undefined
  }

  static propTypes = {
    history: propTypes.object.isRequired,
    posts
  }
  static displayName = 'App'

  state = {
    query: '',
    raw: undefined,
    selectedPost: undefined
  }

  preloaded = Map()

  onMouseEnter = async () => {
    if (this.state.raw) return
    if (!this.state.selectedPost) return

    let raw = await this.fetchRaw()
    this.setState({ raw })
  }

  fetchRaw = async () => {
    const { data: { Post } } = await this.props.client.query({
      query: gql`
        query($id: ID!) {
          Post(id: $id) {
            document {
              raw
            }
          }
        }
      `,
      variables: { id: this.state.selectedPost.id }
    })
    return Post.document.raw
  }

  handleEdit = async () => {
    let raw = this.state.raw
    if (!raw) {
      return
    }
    let contentState = convertFromRaw(
      compact.expand(this.state.raw)
    )
    this.props.setEditorState(
      EditorState.push(
        this.props.editorState,
        contentState
      )
    )
    this.props.history.push('/posts/' + this.state.selectedPost.id)
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

  handleDelete = () => {
    this.props.deletePost({
      id: this.state.selectedPost.id
    })
  }

  handleChange = ({ currentTarget }) => {
    const { value: query } = currentTarget
    this.setState({ query })
  }

  handleSearch = debounce(({ query }) => this.updateVariables({ query }), 1000)

  updateVariables = (params) => {
    const variables = params
    if (params.query === '') {
      return this.props.posts.refetch({
        before: undefined,
        after: undefined,
        first: 8,
        query: '',
        id: this.props.auth.user.id,
        projectId: undefined,
        skip: undefined
      })
    }
    this.props.posts.fetchMore({
      variables: {
        ...this.props.posts.variables,
        ...variables
      },
      updateQuery: (_, { fetchMoreResult }) => {
        return fetchMoreResult
      }
    })
  }

  handleNext = () => this.updateVariables({
    after: this.props.posts.data.allPosts[this.props.posts.data.allPosts.length - 1].id,
    before: undefined,
    first: 5,
    last: undefined
  })

  handlePrev = () => this.updateVariables({
    before: this.props.posts.data.allPosts[0].id,
    after: undefined,
    last: 5,
    first: undefined
  })

  renderToolbar = () => {
    return (
      <AppToolbar
        handleEdit={this.handleEdit}
        handleDelete={this.handleDelete}
        handleNext={this.handleNext}
        handlePrev={this.handlePrev}
        handleChange={this.handleChange}
        handleSearch={this.handleSearch}
        selected={this.state.selectedPost}
        query={this.state.query}
        onMouseEnter={this.onMouseEnter}
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
        <div style={{margin: '0 1em'}}>
          <CreatePost
            selectedProject={this.props.selectedProject}
            user={this.props?.auth?.user?.id} /* eslint-disable-line */
            projects={this.props.projects}
            posts={this.props.posts}
            selectProject={this.props.selectProject}
            client={this.props.client}
          />
          <AdminTable
            posts={this.props.posts}
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

const AppWithRedux = connect(
  state => state,
  dispatch => ({
    setEditorState: editorState => dispatch(setEditorState(editorState))
  })
)(App)

export default withRouter(props => (
  <AppQueries
    {...props}
    render={data => (
      <App
        {...props}
        {...data}
      />
    )} />
))
