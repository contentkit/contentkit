import React from 'react'
import EnhancedInput from '../EnhancedInput'
import SearchIcon from '@material-ui/icons/Search'
import TextField from '@material-ui/core/TextField'
import PropTypes from 'prop-types'

class SearchInput extends React.Component {
  static propTypes = {
    handleSearch: PropTypes.func,
    handleChange: PropTypes.func,
    query: PropTypes.string,
    width: PropTypes.string,
    classes: PropTypes.object
  }

  onKeyDown = keyboardEvent => {
    const { query } = this.props
    switch (keyboardEvent.key) {
      case 'Enter':
        this.props.handleSearch({ query })
        break
      case 'Backspace':
        if (!query) {
          this.props.handleSearch({ query })
        }
    }
  }

  render () {
    const {
      handleChange,
      query,
      classes
    } = this.props
    return (
      <div
        onKeyDown={this.onKeyDown}
        style={{
          display: 'block'
        }}
      >
        <TextField
          margin='none'
          onChange={handleChange}
          value={query}
          className={classes.input}
          variant={'outlined'}
          InputProps={{
            endAdornment: <SearchIcon />
          }}
        />
      </div>
    )
  }
}

export default SearchInput
