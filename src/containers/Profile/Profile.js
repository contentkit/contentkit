import React from 'react'
import PropTypes from 'prop-types'
import Layout from '../Layout'
import UserForm from '../../components/ProfileUserForm'
import { USER_QUERY, GENERATE_TOKEN, UPDATE_USER } from './mutations'
import { Mutation } from 'react-apollo'
import { withRouter } from 'react-router-dom'

class Profile extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    logged: PropTypes.bool,
    auth: PropTypes.object
  }

  state = {
    ref: undefined
  }

  handleChange = (e, key) => {
    const { client } = this.props
    const input = {
      query: USER_QUERY,
      data: {
        user: {
          [key]: e.target.value,
          ...this.props.auth.user
        }
      }
    }
    client.writeQuery(input)
  }

  onCopy = () => {
    this.ref.select()
    document.execCommand('copy')
  }

  render () {
    let { user } = this.props.auth
    return (
      <Layout
        {...this.props}
        loading={this.props.updateUser.loading}>
        <UserForm
          handleChange={this.handleChange}
          updateUser={this.props.updateUser.mutate}
          generateToken={this.props.generateToken}
          onCopy={this.onCopy}
          setRef={ref => { this.ref = ref }}
          {...user}
        />
      </Layout>
    )
  }
}

class ProfileWithData extends React.Component {
  generateToken = ({ auth, mutate }) =>
    variables => mutate({
      variables,
      optimisticResponse: {
        __typename: 'Mutation',
        generateToken: {
          __typename: 'User',
          ...auth.user,
          secret: 'xxx'
        }
      },
      update: (store, { data: { generateToken } }) => {
        const user = {
          ...auth.user,
          secret: generateToken.secret
        }

        store.writeQuery({
          query: USER_QUERY,
          data: { user }
        })
      }
    })

  render () {
    const { auth } = this.props
    return (
      <Mutation mutation={UPDATE_USER}>
        {(updateUser, updateUserData) => {
          return (
            <Mutation mutation={GENERATE_TOKEN}>
              {(generateToken, generateTokenData) => {
                return (
                  <Profile
                    {...this.props}
                    updateUser={{
                      mutate: variables => updateUser({ variables }),
                      ...updateUserData
                    }}
                    generateToken={{
                      mutate: generateToken,
                      ...generateTokenData
                    }}
                  />
                )
              }}
            </Mutation>
          )
        }}
      </Mutation>
    )
  }
}

export default withRouter(ProfileWithData)
