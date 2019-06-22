import React from 'react'
import Input from 'antd/lib/input'
import PropTypes from 'prop-types'

class SearchInput extends React.Component {
  static propTypes = {
    handleSearch: PropTypes.func,
    handleChange: PropTypes.func,
    query: PropTypes.string
  }

  render () {
    const {
      handleChange,
      query,
      classes
    } = this.props
    return (
      <Input.Search
        onChange={handleChange}
        value={query}
        className={classes.input}
        onSearch={() => this.props.handleSearch({ query })}
        style={{
          maxWidth: 200
        }}
      />
    )
  }
}

export default SearchInput
