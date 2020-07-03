import React from 'react'
import PropTypes from 'prop-types'
import { TextField } from '@material-ui/core'
import format from 'date-fns/format'
import parse from 'date-fns/parse'

function PostMetaDatePicker (props) {
  const { onChange, value } = props
  const ref = React.useRef(null)
  const onInputChange = (evt) => {
    const date = parse(evt.target.value, 'yyyy-MM-dd', new Date())
    onChange(date.toISOString())
  }

  React.useEffect(() => {
    if (ref.current) {
      ref.current.value = format(new Date(value), 'yyyy-MM-dd')
    }
  }, [])

  return (
    <TextField
      inputRef={ref}
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
