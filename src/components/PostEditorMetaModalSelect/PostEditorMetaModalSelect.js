// @flow
import React from 'react'
import PropTypes from 'prop-types'
import DefaultSelect from '../../components/Select'

const PostEditorMetaModalSelect = (props: any) => {
  const { post, handleChange } = props

  const onChange = evt => handleChange(evt, 'status')
  const options = [{
    value: 'DRAFT',
    label: 'Draft'
  }, {
    value: 'PUBLISHED',
    label: 'Published'
  }]
  const value = (post.Post && post.Post.postMeta.status)

  return (
    <DefaultSelect
      onChange={onChange}
      options={options}
      label={'Status'}
      value={value}
    />
  )
}

export default PostEditorMetaModalSelect
