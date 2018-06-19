// @flow
import React from 'react'
import propTypes from 'prop-types'
import Layout from '../Layout'
import CreatePost from '../../components/CreatePost'
import DashboardTable from '../../components/DashboardTable'
import { withRouter } from 'react-router-dom'
import DashboardToolbar from '../../components/DashboardToolbar'
import DashboardQueries from './DashboardQueries'
import gql from 'graphql-tag'
import debounce from 'lodash.debounce'
import { postsQueryShape } from '../../shapes'
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
    posts: postsQueryShape
  }

  static displayName = 'Dashboard'

  state = {
    query: '',
    raw: undefined,
    selectedPost: undefined
  }

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
      raw = await this.fetchRaw()
    }
    let expanded = expand(raw)
    let contentState = convertFromRaw(
      expanded
    )
    this.props.setEditorState(
      EditorState.push(
        this.props.editorState,
        contentState,
        'insert-fragment'
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

  updateVariables = (variables) => {
    this.props.posts.fetchMore({
      variables: {
        ...this.props.variables,
        ...variables
      },
      updateQuery: (_, { fetchMoreResult }) => {
        return fetchMoreResult
      }
    })
  }

  handleNext = () => {
    let { posts: { data: { allPosts } } } = this.props
    let after = allPosts[allPosts.length - 1].id

    return this.updateVariables({
      after: after,
      before: undefined,
      first: 5,
      last: undefined
    })
  }

  handlePrev = () => this.updateVariables({
    before: this.props.posts.data.allPosts[0].id,
    after: undefined,
    last: 5,
    first: undefined
  })

  renderToolbar = () => {
    return (
      <DashboardToolbar
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
            user={this.props.auth && this.props.auth.user.id} /* eslint-disable-line */
            projects={this.props.projects}
            posts={this.props.posts}
            selectProject={this.props.selectProject}
            client={this.props.client}
          />
          <DashboardTable
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

export default withRouter(props => (
  <DashboardQueries
    {...props}
    render={data => (
      <Dashboard
        {...props}
        {...data}
      />
    )} />
))
