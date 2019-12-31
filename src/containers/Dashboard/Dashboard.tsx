import React from 'react'
import propTypes from 'prop-types'
import debounce from 'lodash.debounce'
import { withRouter } from 'react-router-dom'
import { compose } from 'react-apollo'
import { useQuery } from '@apollo/react-hooks'
import { connect } from 'react-redux'
import { EditorState } from 'draft-js'
import { AppWrapper } from '@contentkit/components'

import DashboardTable from '../../components/DashboardTable'
import DashboardToolbar from '../../components/DashboardToolbar'
import {
  selectProject,
  selectPosts,
  setEditorState,
  setSearchQuery,
  setSearchLoadingState,
  updateFeedVariables
} from '../../lib/redux'
import CreatePostModal from '../../components/CreatePostModal'
import { feedQueryShape } from '../../shapes'
import { usePostsAggregateQuery, useProjectsQuery } from '../../graphql/queries'
import { GraphQL } from '../../types'

type DashboardProps = {
  posts: GraphQL.PostsAggregateQueryResult,
  projects: GraphQL.ProjectsQueryResult,
  selectedPosts: any,
  search: any,
  client: any,
  history: any,
  editorState: EditorState,
  setEditorState: (editorState: EditorState) => void,
  setSearchLoadingState: (value: boolean) => void,
  setSearchQuery: () => void,
  selectProject: () => void,
  selectPosts: () => void,
  postsAggregateVariables: GraphQL.PostsAggregateQueryVariables
  renderToolbar: () => any
}

function Dashboard (props: DashboardProps) {
  const [open, setOpen] = React.useState(false)

  const {
    posts,
    projects,
    selectedPosts,
    search,
    client,
    history,
    editorState,
    setEditorState,
    setSearchLoadingState,
    setSearchQuery,
    selectProject,
    selectPosts,
    postsAggregateVariables,
    renderToolbar
  } = props

  const updateVariables = (variables: any) => {
    const query = variables.query || ''
    posts.fetchMore({
      variables: {
        ...posts.variables,
        ...variables,
        query: query ? `%${query}%` : '%'
      },
      updateQuery: (_, { fetchMoreResult }) => {
        return fetchMoreResult
      }
    }).then(() => {
      setSearchLoadingState(false)
    })
  }

  const handleProjectSelect = (projectId) => {
    updateVariables({ projectId })
  }

  const handleSearch = ({ query }) => {
    updateVariables({ query })
  }

  const debouncedSearch = debounce(handleSearch, 1000)

  const handleModalOpen = () => {
   setOpen(true)
  }

  const handleModalClose = () => {
    setOpen(false)
  }

  const getToolbarProps = () => {
    return {
      setSearchQuery: setSearchQuery,
      handleSearch: debouncedSearch,
      selected: selectedPosts,
      search: search,
      history: history,
      editorState: editorState,
      setEditorState: setEditorState,
      posts: posts,
      selectedProject: postsAggregateVariables.projectId,
      projects: projects,
      selectProject: selectProject,
      handleOpen: handleModalOpen
    }
  }

  return (
    <AppWrapper>
      <CreatePostModal
        posts={posts}
        projects={projects}
        selectedProject={postsAggregateVariables.projectId}
        selectProject={selectProject}
        open={open}
        handleClose={handleModalClose}
      />
      <DashboardTable
        posts={posts}
        projects={projects}
        selectPosts={selectPosts}
        selectedPosts={selectedPosts}
        renderToolbar={renderToolbar}
        search={search}
        history={history}
        getToolbarProps={getToolbarProps}
      />
    </AppWrapper>
  )
}

function DashboardWithQueries (props) {
  const { postsAggregateVariables } = props
  const variables = {
    ...postsAggregateVariables,
    query: postsAggregateVariables.query ? `%${postsAggregateVariables.query}%` : '%'
  }
  const posts = usePostsAggregateQuery({ variables })
  const projects = useProjectsQuery()
  return (
    <Dashboard {...props} posts={posts} projects={projects} />
  )
}


export default compose(
  withRouter,
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
)(DashboardWithQueries)

