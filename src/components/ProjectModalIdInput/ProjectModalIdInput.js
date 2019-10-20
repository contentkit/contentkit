import React from 'react'
import styles from './styles.scss'
import Input from '../Input'
import { Copy } from '@material-ui/icons'
import { IconButton } from '@material-ui/icore'

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
      inputRef={setRef}
      endAdornment={
        <IconButton
          onClick={onCopy}
          onMouseDown={onCopy}
          className={styles.button}
        >
          <Copy />
        </IconButton>
      }
    />
  )
}

export default ProjectModalIdInput
