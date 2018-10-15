import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import '../css/style.scss'
import { MuiThemeProvider } from '@material-ui/core/styles'
import theme from '../lib/theme'
import { Dashboard, Profile, SignIn, PostEditor, Projects } from './pages'
import Button from '@material-ui/core/Button'
import { unstable_deferredUpdates as deferredUpdates } from 'react-dom'
import { store } from '../lib/redux'
import { Provider } from 'react-redux'

const UP_STAGE = process.env.UP_STAGE || undefined

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
        <BrowserRouter basename={UP_STAGE}>
          <MuiThemeProvider theme={theme}>
            {/*<Route
              exact
              path={'/'}
              render={() => <Button>OK</Button>}
            />*/}
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

export default AppRouter
