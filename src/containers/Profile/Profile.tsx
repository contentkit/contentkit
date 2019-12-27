import React from 'react'
import PropTypes from 'prop-types'
import UserForm from '../../components/ProfileUserForm'
import CodeSnippet from '../../components/CodeSnippet'
import Button from '../../components/Button'
import { Dialog, DialogContent, DialogHeader, DialogActions } from '@material-ui/core'
import { AppWrapper } from '@contentkit/components'
import { withStyles } from '@material-ui/styles'

import { USER_QUERY, useUserQuery } from '../../graphql/queries'
import { GENERATE_TOKEN, UPDATE_USER, DELETE_USER, useGenerateToken, useDeleteUser, useUpdateUser } from '../../graphql/mutations'

import { useMutation } from '@apollo/react-hooks'
import { withRouter } from 'react-router-dom'

class Profile extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    logged: PropTypes.bool,
    user: PropTypes.object
  }

  state = {
    open: false
  }

  handleChange = (e, key) => {
    this.props.client.writeQuery({
      query: USER_QUERY,
      data: {
        users: [{
          ...this.props.users.data.users[0],
          [key]: e.target.value
        }]
      }
    })
  }

  onCopy = () => {
    this.ref.select()
    document.execCommand('copy')
  }

  onConfirm = () => {
    const { deleteUser, users: { data: { users } } } = this.props
    deleteUser.mutate(users[0].id)
  }

  render () {
    const { users, classes } = this.props
    if (users.loading) return null
    return (
      <AppWrapper
        sidebarProps={{
          logged: this.props.logged,
          client: this.props.client,
          history: this.props.history
        }}
      >
        <UserForm
          handleChange={this.handleChange}
          updateUser={this.props.updateUser}
          generateToken={this.props.generateToken.mutate}
          onCopy={this.onCopy}
          setRef={ref => { this.ref = ref }}
          users={users}
          className={classes.container}
        />
        <div className={classes.container}>
          <Button color='danger' onClick={evt => this.setState({ open: true })}>
            Delete Account
          </Button>
        </div>
        <Dialog
          open={this.state.open}
          onClose={evt => this.setState({ open: false })}
        >
          <DialogContent>
            Are you sure?
          </DialogContent>
          <DialogActions>
            <Button onClick={evt => this.setState({ open: false })}>
              Cancel
            </Button>
            <Button color='danger' onClick={this.onConfirm}>
              Delete Account
            </Button>
          </DialogActions>
        </Dialog>
        <div className={classes.code}>
          <CodeSnippet {...this.props} />
        </div>
      </AppWrapper>
    )
  }
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

export default withStyles(theme => ({
  container: {
    margin: '2em auto 1em auto',
    padding: 40,
    maxWidth: 960,
    backgroundColor: '#fff',
    borderRadius: 0,
  },
  code: {
    backgroundImage: 'linear-gradient(160deg, #121212 12.5%, #323232 85%)',
    borderRadius: 0,
    margin: '2em auto 1em auto',
    padding: '40px',
    maxWidth: '960px'
  }
}))(ProfileWithData)
