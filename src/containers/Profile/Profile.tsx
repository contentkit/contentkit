import React from 'react'
import { Dialog, DialogContent, DialogActions } from '@material-ui/core'
import { AppWrapper } from '@contentkit/components'
import { useApolloClient } from '@apollo/client'
import { withRouter } from 'react-router-dom'

import UserForm from '../../components/ProfileUserForm'
import CodeSnippet from '../../components/CodeSnippet'
import Button from '../../components/Button'

import { USER_QUERY, useUserQuery } from '../../graphql/queries'
import { useGenerateToken, useDeleteUser, useUpdateUser } from '../../graphql/mutations'
import TopBar from '../../components/TopBar'
import { useStyles } from './styles'

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
    generateToken,
    history
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
      disablePadding
    >
      <TopBar history={history} />
      <div className={classes.cards}>
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

export default withRouter(ProfileWithData)
