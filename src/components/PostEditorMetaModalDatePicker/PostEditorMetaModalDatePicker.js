import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.scss'
import Input from 'antd/lib/input'

function PostMetaDatePicker (props) {
  const onChange = (evt) => {
    props.handleChange(evt.target.value)
  }

  return (
    <div>
      <Input
        type='text'
        onChange={onChange}
        className={styles.input}
        value={props.value}
      />
    </div>
  )
}

PostMetaDatePicker.propTypes = {
  handleChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
}

export default PostMetaDatePicker
