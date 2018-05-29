// @flow
import React from 'react'
import Button from '@material-ui/core/Button'
import SpinnerAdornment from '../SpinnerAdornment'

function ButtonWithSpinner (props) {
  const {
    children,
    loading,
    ...rest
  } = props
  return (
    <Button {...rest}>
      {children}
      {loading && <SpinnerAdornment {...rest} />}
    </Button>
  )
}

ButtonWithSpinner.defaultProps = {
  loading: false
}

export default ButtonWithSpinner
