import React from 'react'
import { Snackbar, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
  snackbar: {}
}))

type CreatePostSnackbarProps = {
  open: boolean
}

function CreatePostSnackbar (props: CreatePostSnackbarProps) {
  const classes = useStyles(props)
  const { open } = props

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      ContentProps={{
        'aria-describedby': 'snackbar-fab-message-id'
      }}
      message={<span id='snackbar-fab-message-id'>Created</span>}
      action={
        <Button color='inherit' size='small'>
          Undo
        </Button>
      }
      className={classes.snackbar}
    />
  )
}

export default CreatePostSnackbar
