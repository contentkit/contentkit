import React from 'react'
import { TextField, IconButton, InputAdornment } from '@material-ui/core'
import { VisibilityOff, Visibility } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'

export enum LoginFieldVariant {
  LOGIN = 'login',
  PASSWORD = 'password'
}

export const Placeholders = {
 [LoginFieldVariant.LOGIN]: 'Email',
 [LoginFieldVariant.PASSWORD]: 'Password'
}


const useStyles = makeStyles(props => ({
  button: {
    color: '#E2E8F0'
  },
  notchedOutline: {
    borderColor: '#E2E8F0',
    '&:hover': {
      borderColor: '#E2E8F0 !important',  
    }
  },
  root: {
    color: '#E2E8F0',
    '&:hover $notchedOutline': {
      borderColor: '#E2E8F0'
    },
  }
}))

function LoginField (props) {
  const classes = useStyles(props)
  const [show, setShow] = React.useState(null)

  const toggleReveal = () => setShow(show => !show)

  const onMouseDown = evt => {
    evt.preventDefault()
  }

  const {
    onChange,
    value,
    variant
  } = props

  const InputProps = {
    classes: {
      notchedOutline: classes.notchedOutline,
      root: classes.root
    },
    endAdornment: variant === LoginFieldVariant.PASSWORD ? (
      <InputAdornment position='end'>
        <IconButton
          aria-label='toggle password visibility'
          onClick={toggleReveal}
          onMouseDown={onMouseDown}
          className={classes.button}
        >
          {show ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    ) : null
  }

  const type = variant === LoginFieldVariant.LOGIN || show
    ? 'text'
    : 'password'
  return (
    <TextField
      placeholder={Placeholders[variant]}
      margin='dense'
      variant='outlined'
      onChange={onChange}
      value={value}
      type={type}
      fullWidth
      InputProps={InputProps}
    />
  )
}

LoginField.defaultProps = {
  variant: LoginFieldVariant.LOGIN,
}

export default LoginField
