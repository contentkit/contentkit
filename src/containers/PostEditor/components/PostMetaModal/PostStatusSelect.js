// @flow
import React from 'react'
import PropTypes from 'prop-types'
import { default as DefaultSelect } from '../../../../components/Select'

const StatusSelect = props => {
  const { post, handleChange } = props

  const onChange = evt => handleChange(evt, 'status')
  const options = [{
    value: 'DRAFT',
    label: 'Draft'
  }, {
    value: 'PUBLISHED',
    label: 'Published'
  }]
  const value = post?.Post?.postMeta?.status || post?.Post?.status /* eslint-disable-line */

  return (
    <DefaultSelect
      onChange={onChange}
      options={options}
      label={'Status'}
      value={value}
    />
  )
}

export default StatusSelect
