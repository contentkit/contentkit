// @flow
import React from 'react'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import { withStyles } from '@material-ui/core/styles'
import SearchInput from '../DashboardToolbarSearchInput'
import gql from 'graphql-tag'
import { EditorState, convertFromRaw } from 'draft-js'
import { expand } from 'draft-js-compact'

const styles = {
  toolbar: {
    justifyContent: 'space-between'
  },
  input: {
    backgroundColor: '#6cb8ff',
    border: 'none',
    color: '#fff'
  }
}

const fetchRaw = async ({ client, selected }) => {
  const { data: { post } } = await client.query({
    query: gql`
      query($id: ID!) {
        post(id: $id) {
          document {
            raw
          }
        }
      }
    `,
    variables: { id: selected.id }
  })
  return post.document.raw
}

class DashboardToolbar extends React.Component<{}> {
  state = { 
    raw: undefined
  }
  static propTypes = {
    handleChange: PropTypes.func,
    handleSearch: PropTypes.func,
    classes: PropTypes.object
  }

  onMouseEnter = async () => {
    if (this.state.raw) return
    if (!this.props.selected) return

    let raw = await fetchRaw({
      client: this.props.client,
      selected: this.props.selected
    })
    this.setState({ raw })
  }

  handleDelete = () => {
    this.props.deletePost({
      id: this.props.selected.id
    })
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
          expand(raw)
        ),
        'insert-fragment'
      )
    )
    this.props.history.push('/posts/' + this.props.selected.id)
  }

  render () {
    const {
      handleChange,
      handleSearch,
      query,
      width,
      selected,
      classes
    } = this.props
    const open = !!selected
    return (
      <React.Fragment>
        <IconButton
          onClick={this.handleEdit}
          onMouseEnter={this.onMouseEnter}
          disabled={!open}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          onClick={this.handleDelete}
          disabled={!open}
        >
          <DeleteIcon />
        </IconButton>
        <SearchInput
          width={width}
          handleSearch={handleSearch}
          handleChange={handleChange}
          query={query}
          classes={classes}
        />
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(DashboardToolbar)
