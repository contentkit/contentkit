// @flow
import React from 'react'
import PropTypes from 'prop-types'
import Layout from '../Layout'
import UserForm from '../../components/ProfileUserForm'
import { USER_QUERY } from '../../graphql/queries'
import CodeSnippet from '../../components/CodeSnippet'
import classes from './styles.scss'
import Button from '../../components/Button'
import { Dialog, DialogContent, DialogHeader, DialogActions } from '@material-ui/core'

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
    let { users } = this.props
    if (users.loading) return null
    return (
      <Layout
        {...this.props}
        loading={this.props.updateUser.loading}
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
      </Layout>
    )
  }
}

export default Profile
