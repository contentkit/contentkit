import React from 'react'
import { Select, OutlinedInput } from '@material-ui/core'

const PostEditorMetaModalSelect = (props) => {
  const { value, onChange, ...rest } = props

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
      label={'Status'}
      value={value}
      input={<OutlinedInput name='select-status' margin='dense' />}
      {...rest}
    >
      {
        options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)
      }
    </Select>
  )
}

PostEditorMetaModalSelect.propTypes = {}

export default PostEditorMetaModalSelect
