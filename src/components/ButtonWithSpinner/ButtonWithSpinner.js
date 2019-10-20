
import React from 'react'
import { Button } from '@material-ui/core'

const ButtonWithSpinner = props => (
  <Button type={'primary'} {...props} />
)

ButtonWithSpinner.defaultProps = {
  loading: false
}

export default ButtonWithSpinner
