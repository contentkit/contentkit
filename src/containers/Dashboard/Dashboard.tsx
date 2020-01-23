import React from 'react'
import propTypes from 'prop-types'
import debounce from 'lodash.debounce'
import keyBy from 'lodash.keyby'
import { withRouter } from 'react-router-dom'
import { compose } from 'react-apollo'
import { useQuery } from '@apollo/react-hooks'
import { connect } from 'react-redux'
import { EditorState } from 'draft-js'
import { AppWrapper } from '@contentkit/components'
import { Toolbar } from '@material-ui/core'
import DashboardTable from '../../components/DashboardTable'
import DashboardToolbar from '../../components/DashboardToolbar'
import {
  actions
} from '../../store/actions'
import CreatePostModal from '../../components/CreatePostModal'
import { feedQueryShape } from '../../shapes'
import { usePostsAggregateQuery, useProjectsQuery, useSettingsQuery, useUserQuery } from '../../graphql/queries'
import { GraphQL } from '../../types'
import { ModalItem, DashboardSettings } from './types'
import { ModalType, DashboardSettingPropertyNames } from '../../fixtures'
import DashboardSettingsModal from '../../components/DashboardSettingsModal'
import { useSetSettingMutation } from '~graphql/mutations'

const modals = [
  {
    name: ModalType.CREATE_POST,
    Component: CreatePostModal,
    getComponentProps: ({
      users,
      posts,
      projects,
      setSelectedProjectId,
      open,
      onClose,
      settings
    }) => ({
      users,
      posts,
      projects,
      setSelectedProjectId,
      open,
      onClose,
      settings
    })
  },
  {
    name: ModalType.DASHBOARD_SETTINGS,
    Component: DashboardSettingsModal,
    getComponentProps: ({
      onClose,
      settings,
    }) => ({
      onClose,
      settings
    })
  }
]

type DashboardProps = {
  posts: GraphQL.PostsAggregateQueryResult,
  projects: GraphQL.ProjectsQueryResult,
  users: any,
  settings: any,
  setSetting: (variables: any) => void,
  selectedPostIds: string[],
  search: any,
  client: any,
  history: any,
  editorState: EditorState,
  setEditorState: (editorState: EditorState) => void,
  setSearchLoadingState: (value: boolean) => void,
  setSearchQuery: () => void,
  setSelectedProjectId: () => void,
  setSelectedPostIds: () => void,
  postsAggregateVariables: GraphQL.PostsAggregateQueryVariables
  renderToolbar: () => any
}

function Dashboard (props: DashboardProps) {
  const [open, setOpen] = React.useState(null)

  const {
    posts,
    projects,
    users,
    settings,
    setSetting,
    selectedPostIds,
    setSelectedPostIds,
    search,
    client,
    history,
    editorState,
    setEditorState,
    setSearchLoadingState,
    setSearchQuery,
    postsAggregateVariables
  } = props

  const updateVariables = (variables: any) => {
    const query = variables.query || ''

    posts.fetchMore({
      variables: {
        ...posts.variables,
        ...variables,
        query: query ? `%${query}%` : null
      },
      updateQuery: (_, { fetchMoreResult }) => {
        return fetchMoreResult
      }
    }).then(() => {
      setSearchLoadingState(false)
    })
  }

  const handleSearch = ({ query }) => {
    // setSetting({
    //   userId: users.data.users[0].id,
    //   propertyName: DashboardSettingPropertyNames.SEARCH_QUERY,
    //   propertyValue: query ? `%${query}%` : null
    // })
    updateVariables({ query })
  }

  const debouncedSearch = debounce(handleSearch, 1000)

  const onClose = () => {
    setOpen(null)
  }

  const onOpen = key => {
    setOpen(key)
  }

  const getToolbarProps = () => {
    return {
      setSearchQuery: setSearchQuery,
      handleSearch: debouncedSearch,
      search: search,
      history: history,
      editorState: editorState,
      setEditorState: setEditorState,
    
      posts: posts,
      projects: projects,
    
      setSelectedProjectId: setSelectedProjectId,
      settings,
      selectedPostIds: selectedPostIds,

      onOpen: onOpen
    }
  }

  const renderToolbar = () => {
    const toolbarProps = getToolbarProps()
    return (
      <DashboardToolbar
        {...toolbarProps}
      />
    )
  }

  const setSelectedProjectId = (selectedProjectId: string) => {
    setSetting({
      userId: users.data.users[0].id,
      propertyName: DashboardSettingPropertyNames.SELECTED_PROJECT_ID,
      propertyValue: selectedProjectId
    })
  }

  const modalProps = {
    users,
    posts,
    projects,
    settings,
    setSelectedProjectId,
    open,
    onClose,
    onOpen,
    selectedProjectId: settings.selected_project_id
  }

  return (
    <AppWrapper renderToolbar={renderToolbar}>
       {modals.map(({ Component, getComponentProps, name }) => {
        return (
          <Component key={name} {...getComponentProps(modalProps)} open={open === name} onClose={onClose} />
        )
      })}
      <DashboardTable
        posts={posts}
        projects={projects}
        setSelectedPostIds={setSelectedPostIds}
        selectedPostIds={selectedPostIds}
        settings={settings}
        search={search}
        history={history}
        getToolbarProps={getToolbarProps}
      />
    </AppWrapper>
  )
}

function DashboardWithQueries (props) {
  const { postsAggregateVariables } = props
  const projects = useProjectsQuery()
  const settings = useSettingsQuery()

  const variables = {
    ...postsAggregateVariables,
    projectId: settings.dashboard.selected_project_id,
    // query: settings.dashboard.search_query || null
    query: postsAggregateVariables.query ? `%${postsAggregateVariables.query}%` : null
  }

  const users = useUserQuery()
  const posts = usePostsAggregateQuery({ variables, skip: !variables.projectId })
  const setSetting = useSetSettingMutation()
  return (
    <Dashboard
      {...props}
      users={users}
      posts={posts}
      projects={projects}
      settings={settings}
      setSetting={setSetting}
    />
  )
}


export default compose(
  withRouter,
  connect(
    state => state.app,
    actions
  ),
)(DashboardWithQueries)

