import React from 'react'
import { Router, Route } from 'react-router-dom'

import { APP_PATH, PROFILE_PATH } from '../lib/config'
import '../css/style.scss'
import history from '../lib/history'
import { MuiThemeProvider } from '@material-ui/core/styles'
import theme from '../lib/theme'
import { Dashboard, Profile, SignIn, PostEditor, Projects, Playground } from './pages'

import { unstable_deferredUpdates as deferredUpdates } from 'react-dom'
import { store } from '../redux'
import { Provider } from 'react-redux'

class AppRouter extends React.Component {
  state = {
    logged: false,
    loading: true,
    status: 'online'
  }

  static defaultProps = {
    auth: {}
  }

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
    deferredUpdates(() => this.setState(() => {
      if (type !== this.state.status) {
        return null
      }
      return { status: type }
    }))
  }

  render () {
    const auth = this.props.auth
    const { status } = this.state
    const props = {
      logged: Boolean(auth && auth.user), /* eslint-disable-line */
      loading: auth.loading,
      auth: auth,
      client: this.props.client,
      status
    }

    return (
      <Provider store={store}>
        <Router history={history}>
          <MuiThemeProvider theme={theme}>
            <Route
              exact
              path={APP_PATH}
              render={() => <Dashboard {...props} />}
            />
            <Route
              exact
              path={PROFILE_PATH}
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
            <Route
              exact
              path={'/playground'}
              render={() => <Playground {...props} />}
            />
          </MuiThemeProvider>
        </Router>
      </Provider>
    )
  }
}

export default AppRouter
