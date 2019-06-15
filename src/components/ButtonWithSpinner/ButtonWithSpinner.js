
import React from 'react'
import Button from 'antd/lib/button'

const ButtonWithSpinner = props => (
  <Button type={'primary'} {...props} />
)

ButtonWithSpinner.defaultProps = {
  loading: false
}

export default ButtonWithSpinner
