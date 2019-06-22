import React from 'react'
import Icon from 'antd/lib/icon'
import Input from 'antd/lib/input'
import styles from './styles.scss'

function ProjectModalIdInput (props) {
  const {
    onCopy,
    setRef,
    value
  } = props
  return (
    <Input
      className={styles.input}
      value={value}
      ref={setRef}
      addonAfter={
        <button
          onClick={onCopy}
          onMouseDown={onCopy}
          className={styles.button}
        >
          <Icon type={'copy'} />
        </button>
      }
    />
  )
}

export default ProjectModalIdInput
