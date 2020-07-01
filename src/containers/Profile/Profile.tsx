import React from 'react'
import PropTypes from 'prop-types'
import { Dialog, DialogContent, DialogActions } from '@material-ui/core'
import { AppWrapper } from '@contentkit/components'
import { makeStyles } from '@material-ui/styles'
import { useMutation, useApolloClient } from '@apollo/client'
import { withRouter } from 'react-router-dom'

import UserForm from '../../components/ProfileUserForm'
import CodeSnippet from '../../components/CodeSnippet'
import Button from '../../components/Button'

import { USER_QUERY, useUserQuery } from '../../graphql/queries'
import { GENERATE_TOKEN, UPDATE_USER, DELETE_USER, useGenerateToken, useDeleteUser, useUpdateUser } from '../../graphql/mutations'

const useStyles = makeStyles(theme => ({
  userForm: {
    margin: '0 auto 2em auto',
    padding: 40,
    maxWidth: 960,
    backgroundColor: '#fff',
    borderRadius: 0,
  },
  code: {
    // background: '#121212',
    // borderRadius: 0,
    margin: '2em auto 1em auto',
    padding: '40px',
    maxWidth: '960px'
  },
  container: {
    backgroundColor: '#f5f5f5'
  }
}))

type ProfileProps = {
  deleteUser: { mutate: (id: string) => void },
  updateUser: { mutate: (id: string) => void },
  generateToken: { mutate: (variables: { id: string, name: string, email: string }) => void }
}

function Profile (props) {
  const client = useApolloClient()
  const classes = useStyles(props)
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef()
  const {
    users,
    deleteUser,
    updateUser,
    generateToken
  } = props

  const onChange = (key: string, value: any) => {
    client.writeQuery({
      query: USER_QUERY,
      data: {
        users: [{
          ...users.data.users[0],
          [key]: value
        }]
      }
    })
  }

  const onCopy = () => {
    // @ts-ignore
    ref.current.select()
    document.execCommand('copy')
  }

  const onConfirm = () => {
    deleteUser.mutate(users.data.users[0].id)
  }

  const onClose = () => setOpen(false)

  if (users.loading) return null
  return (
    <AppWrapper
      classes={{
        container: classes.container
      }}
    >
      <UserForm
        onChange={onChange}
        updateUser={updateUser}
        generateToken={generateToken.mutate}
        onCopy={onCopy}
        users={users}
        className={classes.userForm}
      />
      <div className={classes.userForm}>
        <Button color='danger' onClick={evt => setOpen(true)}>
          Delete Account
        </Button>
      </div>
      <Dialog
        open={open}
        onClose={onClose}
      >
        <DialogContent>
          Are you sure?
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>
            Cancel
          </Button>
          <Button color='danger' onClick={onConfirm}>
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
      <div className={classes.code}>
        <CodeSnippet {...props} />
      </div>
    </AppWrapper>
  )
}


function ProfileWithData (props) {
  const users = useUserQuery()
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()
  const generateToken = useGenerateToken()

  const { client, history } = props

  const profileProps = {
    ...props,
    users,
    updateUser,
    deleteUser,
    generateToken
  }

  if (users.loading) {
    return false
  }

  return (
    <Profile {...props} {...profileProps} />
  )
}

export default ProfileWithData
