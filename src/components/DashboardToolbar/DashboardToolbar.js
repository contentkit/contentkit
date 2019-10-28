import React from 'react'
import PropTypes from 'prop-types'
import SearchInput from '../DashboardToolbarSearchInput'
import clsx from 'clsx'
import { DELETE_POST } from '../../graphql/mutations'
import { FEED_QUERY } from '../../graphql/queries'
import ProjectSelect from '../ProjectSelect'
import { Toolbar, IconButton } from '@material-ui/core'
import { withStyles } from '@material-ui/styles'

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

class DashboardToolbar extends React.Component {
  state = {
    raw: undefined
  }
  static propTypes = {
    handleChange: PropTypes.func,
    handleSearch: PropTypes.func
  }

  static defaultProps = {
    selected: []
  }

  handleDelete = async () => {
    const { posts, selected } = this.props
    posts.client.cache.writeQuery({
      query: FEED_QUERY,
      data: {
        posts: {
          posts: posts.data.posts.filter((post) => !selected.includes(post.id))
        }
      },
      variables: posts.variables
    })
    await Promise.all(
      selected.map(id => {
        return posts.client.mutate({
          mutation: DELETE_POST,
          variables: { id }
        })
      })
    )
  }

  handleEdit = async () => {
    this.props.history.push('/posts/' + this.props.selected[0])
  }

  handleChange = ({ currentTarget: { value } }) => {
    this.props.setSearchQuery(value)

    if (value === '' || value.length >= 3) {
      this.props.handleSearch({ query: value })
    }
  }

  render () {
    const {
      handleSearch,
      search: { query },
      selected,
      selectedProject,
      projects,
      selectProject,
      classes
    } = this.props
    const open = selected.length > 0
    return (
      <>
        <Toolbar className={classes.root} disableGutters>
          <IconButton
            onClick={this.handleEdit}
            disabled={!open}
            className={clsx(
              classes.button, { [classes.active]: open }
            )}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={this.handleDelete}
            disabled={!open}
            className={clsx(
              classes.button,
              { [classes.active]: open }
            )}
          >
            <DeleteIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              this.props.handleOpen()
            }}
            className={clsx(
              classes.button
            )}
          >
            <FilePlus />
          </IconButton>
        </Toolbar>
        <Toolbar className={classes.filters} disableGutters>
          <ProjectSelect
            selectedProject={selectedProject}
            allProjects={projects?.data?.projects}
            selectProject={selectProject}
            className={classes.select}
          />
          <SearchInput
            handleSearch={handleSearch}
            handleChange={this.handleChange}
            query={query}
            classes={{}}
          />
        </Toolbar>
      </>
    )
  }
}

const styles = theme => ({
  filters: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexBasis: '45%'
  },
  select: {
    width: '100%',
    marginRight: 15
  },
  root: {
    display: 'flex'
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

export default withStyles(styles)(DashboardToolbar)
