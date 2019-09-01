import React from 'react'
import PropTypes from 'prop-types'

import Input from 'antd/lib/input'
import styles from './styles.scss'
import Icon from 'antd/lib/icon'

function ProfileUserFormKeyInput (props) {
  const {
    onCopy,
    setRef,
    generateToken,
    value
  } = props
  return (
    <div>
      <Input
        className={styles.input}
        value={value}
        ref={setRef}
        placeholder={'API key'}
        addonAfter={
          <button
            className={styles.button}
            onClick={() => generateToken()}>
            <Icon type='sync' />
          </button>
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
