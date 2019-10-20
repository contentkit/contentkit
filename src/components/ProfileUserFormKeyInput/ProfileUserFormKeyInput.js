import React from 'react'
import PropTypes from 'prop-types'

import Icon from 'antd/lib/icon'
import { IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import Input from '../Input'

const useStyles = makeStyles(theme => ({
  input: {
    marginBottom: 20
  },
  button: {
    all: 'unset'
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
          <IconButton
            className={classes.button}
            onClick={() => generateToken()}>
            <Icon type='sync' />
          </IconButton>
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
