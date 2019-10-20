import React from 'react'
import PropTypes from 'prop-types'

import { IconButton, InputAdornment } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { Refresh } from '@material-ui/icons'
import Input from '../Input'


const useStyles = makeStyles(theme => ({
  input: {
    marginBottom: 20
  },
  button: {
    // all: 'unset'
  },
  adornment: {
    marginRight: 8
  }
}))

function ProfileUserFormKeyInput (props) {
  const {
    onCopy,
    setRef,
    generateToken,
    value
  } = props
  const classes = useStyles(props)
  return (
    <div>
      <Input
        className={classes.input}
        value={value}
        ref={setRef}
        placeholder={'API key'}
        endAdornment={
          <InputAdornment position='end' className={classes.adornment}>
            <IconButton
              edge='end'
              size='small'
              className={classes.button}
              onClick={() => generateToken()}>
              <Refresh />
            </IconButton>
          </InputAdornment>
        }
        onFocus={onCopy}
      />
    </div>
  )
}

ProfileUserFormKeyInput.propTypes = {
  value: PropTypes.string,
  onCopy: PropTypes.func.isRequired,
  setRef: PropTypes.func.isRequired,
  generateToken: PropTypes.func.isRequired
}

export default ProfileUserFormKeyInput
