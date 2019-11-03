import React from 'react'
import PropTypes from 'prop-types'
import Input from '../Input'

function SearchInput (props) {
  const {
    onChange,
    value,
    className,
    classes,
    ...rest
  } = props

  function onKeyDown (evt) {
    if (evt.which === 13) {
      props.onSearch({ value })
    }
  }

  return (
    <Input
      onChange={onChange}
      value={value}
      className={className}
      onKeyDown={onKeyDown}
      classes={classes}
      {...rest}
    />
  )
}

SearchInput.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string
}

export default SearchInput
