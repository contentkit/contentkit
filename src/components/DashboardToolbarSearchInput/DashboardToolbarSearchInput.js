import React from 'react'
import Input from 'antd/lib/input'
import PropTypes from 'prop-types'

function SearchInput (props) {
  const {
    handleChange,
    query,
    classes
  } = props
  return (
    <Input.Search
      onChange={handleChange}
      value={query}
      className={classes.input}
      onSearch={() => props.handleSearch({ query })}
      style={{
        maxWidth: 200
      }}
    />
  )
}

SearchInput.propTypes = {
  handleSearch: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  query: PropTypes.string
}

export default SearchInput
