import React from 'react'
import { Select, InputBase } from '@material-ui/core'

const PostEditorMetaModalSelect = (props) => {
  const { value, onChange } = props

  const onSelectChange = ({ currentTarget }) => onChange(currentTarget.value, 'status')
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
      onChange={onSelectChange}
      options={options}
      label={'Status'}
      value={value}
      input={<InputBase name='select-status' />}
    >
      {
        options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)
      }
    </Select>
  )
}

PostEditorMetaModalSelect.propTypes = {}

export default PostEditorMetaModalSelect
