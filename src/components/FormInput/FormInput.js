import React from 'react'
import {
  FormHelperText,
  InputLabel,
  FormControl
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import clsx from 'clsx'
import { Input as StyledInputBase } from '@contentkit/components'

const useStyles = makeStyles(theme => ({
  root: {

  },
  input: {
    backgroundColor: '#f4f4f4',
    border: '2px solid #f4f4f4',
    '&:focus-within': {
      borderRadius: 0,
      border: '2px solid #0f62fe'
    }
  }
}))

function FormInput (props) {
  const classes = useStyles(props)
  const { fullWidth, label, className, helperText, ...rest } = props
  return (   
    <FormControl fullWidth={fullWidth}>
      {label && (<InputLabel shrink>{label}</InputLabel>)}
      <StyledInputBase
        className={clsx(classes.input, className)}
        fullWidth
        {...rest}
      />
      {helperText && (<FormHelperText>{helperText}</FormHelperText>)}
    </FormControl>
  )
}

FormInput.defaultProps = {
  fullWidth: true
}

export default FormInput
