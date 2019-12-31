import React from 'react'
import { IconButton, Input, InputAdornment } from '@material-ui/core'
import { VisibilityOff, Visibility } from '@material-ui/icons'

function PasswordField (props) {
  const [show, setShow] = React.useState(null)

  const toggleReveal = () => setShow(show => !show)

  const onMouseDown = evt => {
    evt.preventDefault()
  }

  const {
    onChange,
    value
  } = props
  return (
    <Input
      placeholder={'Password'}
      onChange={onChange}
      value={value}
      type={show ? 'text' : 'password'}
      endAdornment={
        <InputAdornment position='end'>
          <IconButton
            aria-label='toggle password visibility'
            onClick={toggleReveal}
            onMouseDown={onMouseDown}
          >
            {show ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      }
    />
  )
}

export default PasswordField
