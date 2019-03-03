import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { Provider } from 'react-redux'
import { Query, withApollo } from 'react-apollo'

import Spinner from '../components/Spinner'
import '../css/style.scss'
import theme from '../lib/theme'
import { Dashboard, Profile, SignIn, PostEditor, Projects } from './pages'
import { store } from '../lib/redux'
import { USER_QUERY } from '../graphql/queries'

const UP_STAGE = process.env.UP_STAGE || undefined

const styles = {
  width: '100%',
  minHeight: '100vh',
  backgroundColor: '#f4f9fd',
  position: 'absolute',
  padding: '40vh',
  boxSizing: 'border-box',
  top: 0,
  zIndex: 0,
  pointerEvents: 'none'
}

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
    const { user, client } = this.props
    const { status } = this.state
    const props = {
      logged: Boolean(user?.data?.user), /* eslint-disable-line */
      user: user,
      client: client,
      status
    }

    return (
      <Provider store={store}>
        <BrowserRouter basename={UP_STAGE}>
          <MuiThemeProvider theme={theme}>
            <React.Suspense fallback={(
              <div style={{ ...styles }} className={'fadeOut'}>
                <Spinner />
              </div>
            )}>
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
            </React.Suspense>
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
