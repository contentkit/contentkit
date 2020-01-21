import React from 'react'
import { Snackbar } from '@material-ui/core'

export enum Status {
  ONLINE = 'online',
  OFFLINE = 'offline'
}

export function useConnectivity () {
  const [status, setStatus] = React.useState(Status.ONLINE)
  const setOnline = () => {
    if (status === Status.ONLINE) {
      return
    }
    setStatus(Status.ONLINE)
  }
  const setOffline = () => {
    if (status === Status.OFFLINE) {
      return
    }
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
  const status = useConnectivity()
  const onClose = () => setOpen(false)
  React.useEffect(() => {
    setOpen(true)
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

