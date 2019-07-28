// @flow
import React from 'react'
import PropTypes from 'prop-types'
import SearchInput from '../DashboardToolbarSearchInput'
import gql from 'graphql-tag'
import { EditorState, convertFromRaw } from 'draft-js'
import { expand } from 'draft-js-compact'
import classnames from 'classnames'
import { List } from 'immutable'
import Button from 'antd/lib/button'
import styles from './styles.scss'
import { DELETE_POST } from '../../graphql/mutations'
import { FEED_QUERY } from '../../graphql/queries'

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

const fetchRaw = async ({ client, selected }) => {
  const { data: { post } } = await client.query({
    query: gql`
      query($id: ID!) {
        post(id: $id) {
          raw
        }
      }
    `,
    variables: { id: selected }
  })
  return post.raw
}

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

  onMouseEnter = async () => {
    if (this.state.raw) return
    if (!this.props.selected.length) return

    let raw = await fetchRaw({
      client: this.props.client,
      selected: this.props.selected[0]
    })
    this.setState({ raw })
  }

  handleDelete = async () => {
    const { feed, selected } = this.props
    feed.client.cache.writeQuery({
      query: FEED_QUERY,
      data: {
        feed: {
          ...feed.data.feed,
          posts: feed.data.feed.posts.filter((post) => !selected.includes(post.id))
        }
      },
      variables: feed.variables
    })
    await Promise.all(
      selected.map(id => {
        return feed.client.mutate({
          mutation: DELETE_POST,
          variables: { id }
        })
      })
    ) 
  }

  handleEdit = async () => {
    let raw = this.state.raw
    if (!raw) {
      raw = await fetchRaw({
        client: this.props.client,
        selected: this.props.selected
      })
    }
    this.props.setEditorState(
      EditorState.push(
        this.props.editorState,
        convertFromRaw(
          expand(raw, { parent: null, children: List(), prevSibling: null, nextSibling: null })
        ),
        'insert-fragment'
      )
    )
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
      selected
    } = this.props
    const open = selected.length > 0
    return (
      <React.Fragment>
        <div className={styles.root}>
          <button
            onClick={this.handleEdit}
            onMouseEnter={this.onMouseEnter}
            disabled={!open}
            className={classnames(
              styles.button, { [styles.active]: open }
            )}
          >
            <EditIcon />
          </button>
          <button
            onClick={this.handleDelete}
            disabled={!open}
            className={classnames(
              styles.button,
              { [styles.active]: open }
            )}
          >
            <DeleteIcon />
          </button>
        </div>
        <SearchInput
          handleSearch={handleSearch}
          handleChange={this.handleChange}
          query={query}
          classes={{}}
        />
      </React.Fragment>
    )
  }
}

export default DashboardToolbar
