import React from 'react'
import PropTypes from 'prop-types'
import { TextField } from '@material-ui/core'

function PostMetaDatePicker (props) {
  const { onChange, value } = props
  const onInputChange = (evt) => {
    onChange(evt.target.value)
  }

  return (
    <TextField
      value={value}
      onChange={onInputChange}
      variant='outlined'
      margin='dense'
      type='date'
      InputLabelProps={{
        shrink: true
      }}
    />
  )
}

PostMetaDatePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
}

export default PostMetaDatePicker
