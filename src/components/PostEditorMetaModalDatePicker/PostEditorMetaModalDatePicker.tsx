import React from 'react'
import PropTypes from 'prop-types'
import { InputBase, FormControl, InputLabel } from '@material-ui/core'

function PostMetaDatePicker (props) {
  const { onChange, value } = props
  const onInputChange = (evt) => {
    onChange(evt.target.value)
  }

  return (
    <div>
      <FormControl fullWidth>
        <InputBase
          type='text'
          onChange={onInputChange}
          value={value}
          fullWidth
          // label='Date'
        />
      </FormControl>
    </div>
  )
}

PostMetaDatePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
}

export default PostMetaDatePicker
