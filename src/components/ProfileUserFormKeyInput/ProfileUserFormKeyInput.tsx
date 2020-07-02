import React from 'react'
import PropTypes from 'prop-types'

import { IconButton, InputAdornment, TextField } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { Refresh } from '@material-ui/icons'

const useStyles = makeStyles(theme => ({
  input: {},
  button: {},
  adornment: {
    marginRight: 8
  }
}))

type ProfileUserFormKeyInputProps = {
  onCopy: (evt: any) => void,
  generateToken: (evt: any) => void,
  value: string
}

const ProfileUserFormKeyInput = React.forwardRef((props: ProfileUserFormKeyInputProps, ref) => {
  const {
    onCopy,
    generateToken,
    value
  } = props
  const classes = useStyles(props)
  return (
    <TextField
      className={classes.input}
      value={value}
      inputRef={ref}
      placeholder={'API key'}
      variant='outlined'
      margin='dense'
      endAdornment={
        <InputAdornment position='end' className={classes.adornment}>
          <IconButton
            edge='end'
            size='small'
            className={classes.button}
            onClick={generateToken}>
            <Refresh />
          </IconButton>
        </InputAdornment>
      }
      onFocus={onCopy}
    />
  )
})

ProfileUserFormKeyInput.propTypes = {
  // @ts-ignore
  value: PropTypes.string,
  onCopy: PropTypes.func.isRequired,
  generateToken: PropTypes.func.isRequired
}

export default ProfileUserFormKeyInput
