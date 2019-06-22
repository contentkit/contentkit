import React from 'react'
import Input from 'antd/lib/input'
import styles from './styles.scss'
import Icon from 'antd/lib/icon'

const ApiKeyInput = (props) => {
  const {
    onCopy,
    setRef,
    generateToken,
    user,
    id
  } = props
  let secret = user?.data?.user?.secret || ''
  return (
    <div>
      <Input
        className={styles.input}
        value={secret}
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

export default ApiKeyInput
