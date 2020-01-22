import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle
} from '@material-ui/core'
import { useQuery, useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'

function DashboardSettingsModal (props) {
  const { open, onClose } = props
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>

      </DialogContent>
    </Dialog>
  )
}

export default DashboardSettingsModal