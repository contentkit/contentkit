import React from 'react'
import PropTypes from 'prop-types'
import Input from '../Input'

function SearchInput (props) {
  const {
    handleChange,
    query,
    classes
  } = props
  return (
    <Input
      onChange={handleChange}
      value={query}
      className={classes.input}
      onKeyDown={evt => {
        switch (evt.which) {
          case 13:
            props.handleSearch({ query })
            break
          default:
        }
      }}
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
