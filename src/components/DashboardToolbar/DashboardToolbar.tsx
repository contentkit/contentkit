import React from 'react'
import { InputBase, IconButton, Menu, MenuItem } from '@material-ui/core'
import keyBy from 'lodash.keyby'
import { useApolloClient, useQuery } from '@apollo/client'
import gql from 'graphql-tag'

import SearchInput from '../DashboardToolbarSearchInput'
import { DELETE_POST, DELETE_POST_TAG_CONNECTION } from '../../graphql/mutations'
import { POSTS_AGGREGATE_QUERY } from '../../graphql/queries'
import ProjectSelect from '../ProjectSelect'
import Button from '../Button'
import { ModalType } from '../../fixtures'
import { useStyles } from './styles'
import { useSnackbar } from 'notistack'

const EditIcon = props => (
  <svg
    width='18'
    height='18'
    aria-hidden='true'
    focusable='false'
    role='img'
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 576 512'
  >
    <path fill='currentColor' d='M417.8 315.5l20-20c3.8-3.8 10.2-1.1 10.2 4.2V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h292.3c5.3 0 8 6.5 4.2 10.2l-20 20c-1.1 1.1-2.7 1.8-4.2 1.8H48c-8.8 0-16 7.2-16 16v352c0 8.8 7.2 16 16 16h352c8.8 0 16-7.2 16-16V319.7c0-1.6.6-3.1 1.8-4.2zm145.9-191.2L251.2 436.8l-99.9 11.1c-13.4 1.5-24.7-9.8-23.2-23.2l11.1-99.9L451.7 12.3c16.4-16.4 43-16.4 59.4 0l52.6 52.6c16.4 16.4 16.4 43 0 59.4zm-93.6 48.4L403.4 106 169.8 339.5l-8.3 75.1 75.1-8.3 233.5-233.6zm71-85.2l-52.6-52.6c-3.8-3.8-10.2-4-14.1 0L426 83.3l66.7 66.7 48.4-48.4c3.9-3.8 3.9-10.2 0-14.1z'>
    </path>
  </svg>
)

const CogIcon = props => (
  <svg 
    focusable="false" 
    preserveAspectRatio="xMidYMid meet"
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    aria-hidden="true"
  >
    <path d="M13.5,8.4c0-0.1,0-0.3,0-0.4c0-0.1,0-0.3,0-0.4l1-0.8c0.4-0.3,0.4-0.9,0.2-1.3l-1.2-2C13.3,3.2,13,3,12.6,3	c-0.1,0-0.2,0-0.3,0.1l-1.2,0.4c-0.2-0.1-0.4-0.3-0.7-0.4l-0.3-1.3C10.1,1.3,9.7,1,9.2,1H6.8c-0.5,0-0.9,0.3-1,0.8L5.6,3.1	C5.3,3.2,5.1,3.3,4.9,3.4L3.7,3C3.6,3,3.5,3,3.4,3C3,3,2.7,3.2,2.5,3.5l-1.2,2C1.1,5.9,1.2,6.4,1.6,6.8l0.9,0.9c0,0.1,0,0.3,0,0.4	c0,0.1,0,0.3,0,0.4L1.6,9.2c-0.4,0.3-0.5,0.9-0.2,1.3l1.2,2C2.7,12.8,3,13,3.4,13c0.1,0,0.2,0,0.3-0.1l1.2-0.4	c0.2,0.1,0.4,0.3,0.7,0.4l0.3,1.3c0.1,0.5,0.5,0.8,1,0.8h2.4c0.5,0,0.9-0.3,1-0.8l0.3-1.3c0.2-0.1,0.4-0.2,0.7-0.4l1.2,0.4	c0.1,0,0.2,0.1,0.3,0.1c0.4,0,0.7-0.2,0.9-0.5l1.1-2c0.2-0.4,0.2-0.9-0.2-1.3L13.5,8.4z M12.6,12l-1.7-0.6c-0.4,0.3-0.9,0.6-1.4,0.8	L9.2,14H6.8l-0.4-1.8c-0.5-0.2-0.9-0.5-1.4-0.8L3.4,12l-1.2-2l1.4-1.2c-0.1-0.5-0.1-1.1,0-1.6L2.2,6l1.2-2l1.7,0.6	C5.5,4.2,6,4,6.5,3.8L6.8,2h2.4l0.4,1.8c0.5,0.2,0.9,0.5,1.4,0.8L12.6,4l1.2,2l-1.4,1.2c0.1,0.5,0.1,1.1,0,1.6l1.4,1.2L12.6,12z"></path>
    <path d="M8,11c-1.7,0-3-1.3-3-3s1.3-3,3-3s3,1.3,3,3C11,9.6,9.7,11,8,11C8,11,8,11,8,11z M8,6C6.9,6,6,6.8,6,7.9C6,7.9,6,8,6,8	c0,1.1,0.8,2,1.9,2c0,0,0.1,0,0.1,0c1.1,0,2-0.8,2-1.9c0,0,0-0.1,0-0.1C10,6.9,9.2,6,8,6C8.1,6,8,6,8,6z"></path>
  </svg>
)

function DashboardToolbar (props) {
  const {
    posts,
    projects,
    selectedPostIds,
    onSearch,
    history,
    selectedProjectId,
    setSelectedProjectId,
    settings,
    setSearchLoading,
    onOpen
  } = props
  const classes = useStyles(props)
  const [anchorEl, setAnchorEl] = React.useState(null)
  const client = useApolloClient()
  const users = useQuery(gql`query { users { id } }`)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const timer = React.useRef(null)

  const onDelete = async () => {
    const { data: { posts_aggregate: { nodes } } } = posts
    const lookup = keyBy(nodes, 'id')

    const writeNodes = (nodes) => {
      return client.writeQuery({
        query: POSTS_AGGREGATE_QUERY,
        data: {
          posts_aggregate: {
            ...posts.data.posts_aggregate,
            nodes: nodes
          }
        },
        variables: posts.variables
      })
    }

    const cancel = key => () => {
      closeSnackbar(key)
      clearInterval(timer.current)
      writeNodes(nodes)
    }

    enqueueSnackbar(`Deleted ${selectedPostIds.map(id => lookup[id].title).join(', ')}`, {
      variant: 'info',
      action: key => (
        <Button color="inherit" size="small" onClick={cancel(key)}>
          Undo
        </Button>
      )
    })


    writeNodes(
      nodes.filter((post) => !selectedPostIds.includes(post.id))
    )

    timer.current = window.setTimeout(async () => {
      const userId = users.data.users[0].id
      await Promise.all(
        selectedPostIds.map(async id => {
          const post = lookup[id]
          await Promise.all(
            post.posts_tags.map(({ tag }) => {
              return client.mutate({
                mutation: DELETE_POST_TAG_CONNECTION,
                variables: {
                  postId: id,
                  tagId: tag.id
                }
              })
            })
          )
          return posts.client.mutate({
            mutation: DELETE_POST,
            variables: { id, userId }
          })
        })
      )
    }, 4000)
  }

  const onEdit = () => {
    const uri = `/posts/${selectedPostIds[0]}`
    history.push(uri)
  }

  const onMenuOpen = evt => {
    setAnchorEl(evt.target)
  }
  
  const onMenuClose = () => {
    setAnchorEl(null)
  }
  
  const onOpenSettingsModal = () => {
    onOpen(ModalType.DASHBOARD_SETTINGS)
  }

  const onOpenCreatePostModal = () => {
    onOpen(ModalType.CREATE_POST)
  }

  return (
    <div className={classes.root}>
      <div className={classes.flex}>
        <div className={classes.toolbar}>
          <SearchInput
            onSearch={onSearch}
            placeholder={'Search...'}
            setSearchLoading={setSearchLoading}
          />
          <ProjectSelect
            selectedProjectId={settings.dashboard.selected_project_id}
            allProjects={projects?.data?.projects}
            setSelectedProjectId={setSelectedProjectId}
            className={classes.select}
            input={<InputBase />}
          />
        </div>
        <div className={classes.actions}>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={onMenuClose}
          >
            <MenuItem key='edit' onClick={onEdit}>Edit</MenuItem>
            <MenuItem key='delete' onClick={onDelete}>Delete</MenuItem>
          </Menu>
          <IconButton onClick={onMenuOpen} disabled={!selectedPostIds.length}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={onOpenSettingsModal}>
            <CogIcon />
          </IconButton>
          <Button onClick={onOpenCreatePostModal} className={classes.newPostButton}>New Post</Button>
        </div>
      </div>
    </div>
  )
}

DashboardToolbar.defaultProps = {
  selectedPostIds: []
}

export default DashboardToolbar
