import React from 'react'
import PropTypes from 'prop-types'
import { Input } from '@contentkit/components'

type SearchInputProps = {
  onChange: (evt: any) => void,
  value: string,
  className: string,
  classes: any,
  onSearch: ({ value: string }) => void,
  placeholder?: string
}

function SearchInput (props: SearchInputProps) {
  const {
    onChange,
    value,
    className,
    classes,
    onSearch,
    ...rest
  } = props

  function onKeyDown (evt) {
    if (evt.which === 13) {
      onSearch({ value })
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
