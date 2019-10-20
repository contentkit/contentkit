// @flow
import React from 'react'
import PropTypes from 'prop-types'
import Layout from '../Layout'
import UserForm from '../../components/ProfileUserForm'
import { USER_QUERY } from '../../graphql/queries'
import CodeSnippet from '../../components/CodeSnippet'
import classes from './styles.scss'
// import Button from 'antd/lib/button'
import Popconfirm from 'antd/lib/popconfirm'
import Button from '../../components/Button'

class Profile extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    logged: PropTypes.bool,
    user: PropTypes.object
  }

  handleChange = (e, key) => {
    this.props.client.writeQuery({
      query: USER_QUERY,
      data: {
        user: {
          ...this.props.user.data.user,
          [key]: e.target.value
        }
      }
    })
  }

  onCopy = () => {
    this.ref.select()
    document.execCommand('copy')
  }

  onConfirm = () => {
    this.props.deleteUser.mutate()
  }

  render () {
    let { user } = this.props
    console.log('Profile', this.props)
    if (user.loading) return null
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
          user={user}
          className={classes.container}
        />
        <div className={classes.container}>
          <Popconfirm title={'Are you sure?'} onConfirm={this.onConfirm} okText='Delete' cancelText='Cancel'>
            <Button color='danger'>
              Delete Account
            </Button>
          </Popconfirm>
        </div>
        <div className={classes.code}>
          <CodeSnippet {...this.props} />
        </div>
      </Layout>
    )
  }
}

export default Profile
