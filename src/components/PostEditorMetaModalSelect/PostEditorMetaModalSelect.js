import React from 'react'
import PropTypes from 'prop-types'
import { Select } from '@material-ui/core'
import { Input } from '@contentkit/components'

const PostEditorMetaModalSelect = (props) => {
  const { value, handleChange } = props

  const onChange = ({ currentTarget }) => handleChange(currentTarget.value, 'status')
  const options = [{
    value: 'DRAFT',
    label: 'Draft'
  }, {
    value: 'PUBLISHED',
    label: 'Published'
  }]

  return (
    <Select
      native
      onChange={onChange}
      options={options}
      label={'Status'}
      value={value}
      input={<Input name='select-status' />}
    >
      {
        options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)
      }
    </Select>
  )
}

export default PostEditorMetaModalSelect
