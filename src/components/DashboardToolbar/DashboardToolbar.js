import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Snackbar, Toolbar, IconButton, Menu, MenuItem, InputAdornment, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/styles'
import { withApollo, compose } from 'react-apollo'
import clsx from 'clsx'
import keyBy from 'lodash.keyby'
import { SearchOutlined } from '@material-ui/icons'
import SearchInput from '../DashboardToolbarSearchInput'
import { DELETE_POST } from '../../graphql/mutations'
import { POSTS_AGGREGATE_QUERY } from '../../graphql/queries'
import ProjectSelect from '../ProjectSelect'
import Button from '../Button'

const EditIcon = props => (
  <svg
    width='24'
    height='24'
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

const DeleteIcon = props => (
  <svg
    width='22'
    height='22'
    aria-hidden='true'
    focusable='false'
    data-prefix='fal'
    data-icon='trash'
    role='img'
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 448 512'
  >
    <path fill='currentColor' d='M440 64H336l-33.6-44.8A48 48 0 0 0 264 0h-80a48 48 0 0 0-38.4 19.2L112 64H8a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h18.9l33.2 372.3a48 48 0 0 0 47.8 43.7h232.2a48 48 0 0 0 47.8-43.7L421.1 96H440a8 8 0 0 0 8-8V72a8 8 0 0 0-8-8zM171.2 38.4A16.1 16.1 0 0 1 184 32h80a16.1 16.1 0 0 1 12.8 6.4L296 64H152zm184.8 427a15.91 15.91 0 0 1-15.9 14.6H107.9A15.91 15.91 0 0 1 92 465.4L59 96h330z'></path>
  </svg>
)

const FilePlus = props => (
  <svg
    width='22'
    height='22'
    aria-hidden="true"
    focusable="false"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 384 512"
  >
    <path fill="currentColor" d="M369.9 97.9L286 14C277 5 264.8-.1 252.1-.1H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V131.9c0-12.7-5.1-25-14.1-34zm-22.6 22.7c2.1 2.1 3.5 4.6 4.2 7.4H256V32.5c2.8.7 5.3 2.1 7.4 4.2l83.9 83.9zM336 480H48c-8.8 0-16-7.2-16-16V48c0-8.8 7.2-16 16-16h176v104c0 13.3 10.7 24 24 24h104v304c0 8.8-7.2 16-16 16zm-48-180v8c0 6.6-5.4 12-12 12h-68v68c0 6.6-5.4 12-12 12h-8c-6.6 0-12-5.4-12-12v-68h-68c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h68v-68c0-6.6 5.4-12 12-12h8c6.6 0 12 5.4 12 12v68h68c6.6 0 12 5.4 12 12z">
    </path>
  </svg>
)


const Cog = props => (
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

class DashboardToolbar extends React.Component {
  state = {
    anchorEl: undefined,
    snackbarOpen: false,
    snackbarMessage: ''
  }

  static propTypes = {
    handleChange: PropTypes.func,
    handleSearch: PropTypes.func
  }

  static defaultProps = {
    selected: []
  }

  resetSnackbar = () => {
    this.setState({
      snackbarMessage: '',
      snackbarOpen: false
    })
  }

  undoAction = evt => {
    this.cancel()
    this.resetSnackbar()
  }

  onCloseSnackbar = async evt => {
    this.resetSnackbar()
  }

  onDelete = async () => {
    const { client, posts, selected, users } = this.props
    const { data: { posts_aggregate: { nodes } } } = posts
    const lookup = keyBy(nodes, 'id')

    this.setState({
      snackbarOpen: true,
      snackbarMessage: `Deleted ${selected.map(id => lookup[id].title).join(', ')}`
    })

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

    writeNodes(
      nodes.filter((post) => !selected.includes(post.id))
    )

    this.cancel = () => {
      clearInterval(this.timerID)
      writeNodes(nodes)
    }

    this.timerID = window.setTimeout(async () => {
      const { posts, selected, users } = this.props
      const userId = users.data.users[0].id
      await Promise.all(
        selected.map(id => posts.client.mutate({
          mutation: DELETE_POST,
          variables: { id, userId }
        }))
      )
    }, 4000)
  }

  onEdit = async () => {
    this.props.history.push('/posts/' + this.props.selected[0])
  }

  handleChange = ({ currentTarget: { value } }) => {
    this.props.setSearchQuery(value)

    if (value === '' || value.length >= 3) {
      this.props.handleSearch({ query: value })
    }
  }

  onMenuOpen = evt => {
    this.props.setContextMenuAnchorEl(evt)
  }

  render () {
    const {
      handleSearch,
      search: { query },
      selected,
      selectedProject,
      projects,
      selectProject,
      classes,
      contextMenuAnchorEl,
      contextMenuOnClose
    } = this.props
    const open = selected.length > 0
    const { snackbarMessage, snackbarOpen } = this.state
    return (
      <div className={classes.root}>
        <Typography variant='subtitle2' style={{ padding: '10px 0px 0px 10px' }}>Posts</Typography>
        <div className={classes.flex}>
          <div className={classes.toolbar}>
            <SearchInput
              onSearch={handleSearch}
              onChange={this.handleChange}
              value={query}
              className={classes.input}
              placeholder={'Search...'}
            />
            <ProjectSelect
              selectedProject={selectedProject}
              allProjects={projects?.data?.projects}
              selectProject={selectProject}
              className={classes.select}
            />
          </div>
          <div className={classes.actions}>
            <Menu
              anchorEl={contextMenuAnchorEl}
              open={Boolean(contextMenuAnchorEl)}
              onClose={contextMenuOnClose}
            >
              <MenuItem key='edit' onClick={this.onEdit}>Edit</MenuItem>
              <MenuItem key='delete' onClick={this.onDelete}>Delete</MenuItem>
            </Menu>
            <IconButton onClick={this.onMenuOpen} disabled={!selected.length}>
              <Cog />
            </IconButton>
            <Button onClick={this.props.handleOpen}>New Post</Button>
          </div>
        </div>
        <Snackbar
          open={snackbarOpen}
          onClose={this.onCloseSnackbar}
          autoHideDuration={4000}
          ContentProps={{
            'aria-describedby': 'snackbar-fab-message-id',
          }}
          message={<span id="snackbar-fab-message-id">{snackbarMessage}</span>}
          action={
            <Button color="inherit" size="small" onClick={this.undoAction}>
              Undo
            </Button>
          }
          className={classes.snackbar}
        />
        </div>
    )
  }
}

const styles = theme => ({
  input: {
    // width: 500
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexBasis: '45%'
  },
  select: {
    width: '100%',
    marginRight: 15
  },
  root: {
    width: '100%',
    backgroundColor: '#f4f4f4',
    display: 'flex',
    flexDirection: 'column'
  },
  flex: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#f4f4f4'
  },
  toolbar: {
    display: 'flex',
    '& > div': {
      flexBasis: '50%'
    }
  },
  button: {
    borderRadius: 0,
    color: '#000'
  },
  active: {
    color: theme.variables.iconColorActive,
    '&:hover': {
      color: theme.variables.iconColorHover,
      cursor: 'pointer'
    }
  }
})

export default compose(
  withStyles(styles),
  withApollo
)(DashboardToolbar)
