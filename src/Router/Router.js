import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { Provider } from 'react-redux'

import '../css/style.scss'
import theme from '../lib/theme'
import { Dashboard, Profile, SignIn, PostEditor, Projects } from './pages'
import { store } from '../lib/redux'
import { USER_QUERY } from '../graphql/queries'
import { Query, withApollo } from 'react-apollo'

const UP_STAGE = process.env.UP_STAGE || undefined

class AppRouter extends React.Component {
  state = {
    logged: false,
    loading: true,
    status: 'online'
  }

  static defaultProps = {}

  static displayName = 'AppRouter'

  componentDidMount () {
    window.addEventListener('online', this.handleStatus)
    window.addEventListener('offline', this.handleStatus)
  }

  componentWillUnmount () {
    window.removeEventListener('online', this.handleStatus)
    window.removeEventListener('offline', this.handleStatus)
  }

  handleStatus = ({ type }) => {
    window.requestIdleCallback(() => this.setState(() => {
      if (type !== this.state.status) {
        return null
      }
      return { status: type }
    }))
  }

  render () {
    const { user } = this.props
    const { status } = this.state
    const props = {
      logged: Boolean(user?.data?.user), /* eslint-disable-line */
      user: user,
      client: this.props.client,
      status
    }

    return (
      <Provider store={store}>
        <BrowserRouter basename={UP_STAGE}>
          <MuiThemeProvider theme={theme}>
            <Route
              exact
              path={'/'}
              render={() => <Dashboard {...props} />}
            />
            <Route
              exact
              path={'/profile'}
              render={() => <Profile {...props} />}
            />
            <Route
              exact
              path={'/login'}
              render={() => <SignIn {...props} />}
            />
            <Route
              path={'/posts/:id'}
              render={() => <PostEditor {...props} />}
            />
            <Route
              exact
              path={'/projects/:id?'}
              render={() => <Projects {...props} />}
            />
          </MuiThemeProvider>
        </BrowserRouter>
      </Provider>
    )
  }
}

export default withApollo(props => (
  <Query query={USER_QUERY}>
    {(user) => {
      return <AppRouter {...props} user={user} />
    }}
  </Query>
))
