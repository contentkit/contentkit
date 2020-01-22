import React from 'react'
import useEventCallback from '@material-ui/core/utils/useEventCallback'
import { CircularProgress } from '@material-ui/core'

function EpehemeralProgress (props) {
  console.log(props)
  const [visible, setVisible] = React.useState(false)
  const timerRef = React.useRef(0)

  const { open, autoHideDuration, onClose } = props


  const exit = () => {
    setVisible(false)
    onClose()
  }

  React.useEffect(() => {
    clearTimeout(timerRef.current)
    if (!open) {
      return
    }
  
    setVisible(true)
    // @ts-ignore
    timerRef.current = setTimeout(exit, autoHideDuration) 
  }, [open])

  if (visible) {
    return <CircularProgress />
  }
  
  return null
}

EpehemeralProgress.defaultProps = {
  open: false,
  autoHideDuration: 2000
}

export default EpehemeralProgress
