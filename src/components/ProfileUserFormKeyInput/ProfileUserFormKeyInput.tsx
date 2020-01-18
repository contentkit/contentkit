import React from 'react'
import PropTypes from 'prop-types'

import { IconButton, InputAdornment } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { Refresh } from '@material-ui/icons'
import { Input } from '@contentkit/components'

const useStyles = makeStyles(theme => ({
  input: {},
  button: {},
  adornment: {
    marginRight: 8
  }
}))

const ProfileUserFormKeyInput = React.forwardRef((props, ref) => {
  const {
    onCopy,
    generateToken,
    value
  } = props
  const classes = useStyles(props)
  return (
    <Input
      className={classes.input}
      value={value}
      ref={ref}
      placeholder={'API key'}
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
