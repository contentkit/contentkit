import React from 'react'
import Input from 'antd/lib/input'
import ClipboardIcon from '@material-ui/icons/FileCopy'
import RefreshIcon from '@material-ui/icons/Autorenew'
import styles from './styles.scss'

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
            <RefreshIcon />
          </button>
        }
        onFocus={onCopy}
      />
    </div>
  )
}

export default ApiKeyInput
