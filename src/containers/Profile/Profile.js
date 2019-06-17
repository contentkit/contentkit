// @flow
import React from 'react'
import PropTypes from 'prop-types'
import Layout from '../Layout'
import UserForm from '../../components/ProfileUserForm'
import { USER_QUERY } from '../../graphql/queries'
import CodeSnippet from '../../components/CodeSnippet'

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
          />
          <div style={{
            maxWidth: '500px',
            padding: '2em',
            margin: '1em auto'
          }}>
            <CodeSnippet {...this.props} />
          </div>
        </article>
      </Layout>
    )
  }
}

export default Profile
