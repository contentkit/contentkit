import React from 'react'
import { Snackbar } from '@material-ui/core'

export enum Status {
  ONLINE = 'online',
  OFFLINE = 'offline'
}

export function useConnectivity () {
  const [status, setStatus] = React.useState(Status.ONLINE)
  const setOnline = () => {
    setStatus(Status.ONLINE)
  }
  const setOffline = () => {
    setStatus(Status.OFFLINE)
  }

  React.useEffect(() => {
    window.addEventListener('online', setOnline)
    window.addEventListener('offline', setOffline)

    return () => {
      window.removeEventListener('online', setOnline)
      window.removeEventListener('offline', setOffline)
    }
  }, [])

  return status
}

export function OfflineNotification (props) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef(Status.ONLINE)
  const status = useConnectivity()
  const onClose = () => setOpen(false)
  React.useEffect(() => {
    if (ref.current !== status) {
      ref.current = status
      setOpen(true)
    }
  }, [status])

  const { children } = props
  const message = `You are ${status === Status.ONLINE ? 'online' : 'offline'}`
  return (
    <React.Fragment>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={6000}
        onClose={onClose}
        message={message}
      />
      {children}
    </React.Fragment>
  )
}

