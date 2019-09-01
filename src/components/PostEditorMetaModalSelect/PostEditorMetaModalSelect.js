import React from 'react'
import PropTypes from 'prop-types'
import Select from 'antd/lib/select'

const PostEditorMetaModalSelect = (props) => {
  const { value, handleChange } = props

  const onChange = evt => handleChange(evt, 'status')
  const options = [{
    value: 'DRAFT',
    label: 'Draft'
  }, {
    value: 'PUBLISHED',
    label: 'Published'
  }]

  return (
    <Select
      onChange={onChange}
      options={options}
      label={'Status'}
      value={value}
    >
      {
        options.map(option => <Select.Option key={option.value}>{option.label}</Select.Option>)
      }
    </Select>
  )
}

export default PostEditorMetaModalSelect
