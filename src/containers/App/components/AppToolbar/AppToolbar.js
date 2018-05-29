// @flow
import React from 'react'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import { withStyles } from '@material-ui/core/styles'
import KeyboardArrows from './KeyboardArrows'
// import withWidth from '@material-ui/core/utils/withWidth'
import compose from 'recompose/compose'
import SearchInput from './SearchInput'

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

class AppToolbar extends React.Component<{}> {
  shouldComponentUpdate (nextProps, nextState) {
    return nextProps?.selected?.id !== this.props?.selected?.id
  }

  static propTypes = {
    handleEdit: PropTypes.func,
    handleDelete: PropTypes.func,
    handleChange: PropTypes.func,
    handleSearch: PropTypes.func,
    open: PropTypes.bool,
    classes: PropTypes.object
  }

  handleEdit = () => this.props.handleEdit(
    this.props.selected.id
  )

  handleDelete = () => this.props.handleDelete(
    this.props.selected.id
  )

  render () {
    const {
      handleChange,
      handleSearch,
      onMouseEnter,
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
          onMouseEnter={onMouseEnter}
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
        <KeyboardArrows
          handleNext={this.props.handleNext}
          handlePrev={this.props.handlePrev}
        />
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

export default compose(
  withStyles(styles)
  // withWidth()
)(AppToolbar)
