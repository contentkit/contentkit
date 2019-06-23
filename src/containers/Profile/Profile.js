// @flow
import React from 'react'
import PropTypes from 'prop-types'
import Layout from '../Layout'
import UserForm from '../../components/ProfileUserForm'
import { USER_QUERY } from '../../graphql/queries'
import CodeSnippet from '../../components/CodeSnippet'
import classes from './styles.scss'
import Button from 'antd/lib/button'
import Popconfirm from 'antd/lib/popconfirm'

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
    return (
      <Layout
        {...this.props}
        loading={this.props.updateUser.loading}>
        <article>
          <UserForm
            handleChange={this.handleChange}
            updateUser={this.props.updateUser.mutate}
            generateToken={this.props.generateToken.mutate}
            onCopy={this.onCopy}
            setRef={ref => { this.ref = ref }}
            user={user}
            className={classes.container}
          />
          <div className={classes.container}>
            <Popconfirm title={'Are you sure?'} onConfirm={this.onConfirm} okText='Delete' cancelText='Cancel'>
              <Button type={'danger'}>
                Delete Account
              </Button>
            </Popconfirm>
          </div>
          {/*<div className={classes.container}>
            <CodeSnippet {...this.props} />
          </div>*/}
        </article>
      </Layout>
    )
  }
}

export default Profile
