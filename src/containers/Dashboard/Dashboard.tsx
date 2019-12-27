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
import { POSTS_AGGREGATE_QUERY, PROJECTS_QUERY } from '../../graphql/queries'

function Dashboard (props) {
  const [open, setOpen] = React.useState(false)

  const {
    posts,
    selectedPosts,
    search,
    client,
    history,
    editorState,
    setEditorState,
    setSearchLoadingState,
    setSearchQuery,
    selectProject,
    postsAggregateVariables,
    projects,
    users,
    logged,
    renderToolbar
  } = props

  const updateVariables = (variables) => {
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
      handleOpen: handleModalOpen,
      users: users
    }
  }

  return (
    <AppWrapper
      sidebarProps={{ history, logged, client }}
    >
      <CreatePostModal
        posts={posts}
        selectedProject={postsAggregateVariables.projectId}
        projects={projects}
        selectProject={selectProject}
        open={open}
        handleClose={handleModalClose}
        users={users}
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
  const posts = useQuery(POSTS_AGGREGATE_QUERY, { variables })
  const projects = useQuery(PROJECTS_QUERY)
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

