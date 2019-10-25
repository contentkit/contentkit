import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.scss'
import Input from '../Input'
import { FormControl, InputLabel } from '@material-ui/core'

function PostMetaDatePicker (props) {
  const onChange = (evt) => {
    props.handleChange(evt.target.value)
  }

  return (
    <div>
      <FormControl fullWidth>
        <InputLabel>Date</InputLabel>
        <Input
          type='text'
          onChange={onChange}
          className={styles.input}
          value={props.value}
          fullWidth
        />
      </FormControl>
    </div>
  )
}

PostMetaDatePicker.propTypes = {
  handleChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
}

export default PostMetaDatePicker
