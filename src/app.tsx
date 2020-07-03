import * as React from 'react'
import ReactDOM from 'react-dom'
import { CircularProgress } from '@material-ui/core'
import { ApolloProvider, useQuery } from '@apollo/client'
import { BrowserRouter, Route, Redirect } from 'react-router-dom'
import { Provider, ReactReduxContext } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { SnackbarProvider } from 'notistack'
import { OfflineNotification } from './lib/withConnectivity'
import client from './lib/client'
import { store, history } from './store'
import pages from './pages'
import './css/style.scss'
import { ThemeProvider } from './lib/theme'
import { USER_AUTH_QUERY } from './graphql/queries'

const UP_STAGE = process.env.UP_STAGE || undefined

function AuthProvider (props)  {
  const userQuery = useQuery(USER_AUTH_QUERY)


  React.useEffect(() => {
    if (userQuery?.data?.users?.length) {
      if (!window.localStorage.getItem('user_id')) {
        window.localStorage.setItem('user_id', userQuery.data.users[0].id)
      }
    }
  }, [userQuery])

  const getContent = () => {
    if (userQuery.data?.users) { 
      return (
        <Redirect to='/dashboard' />
      )
    }
  
    if (userQuery.error) {
      window.localStorage.removeItem('token')
      window.localStorage.removeItem('user_id')
      return (
        <Redirect to='/login' />
      )
    }
  
    return (<CircularProgress />)
  }

  return getContent()
}

function App (props) {
  const notistackRef = React.createRef()

  const onDismiss = (key) => {
    // @ts-ignore
    notistackRef.current.closeSnackbar(key)
  }

  return (
    <SnackbarProvider maxSnack={3} ref={notistackRef}>
      <Provider store={store} context={ReactReduxContext}>
        <ConnectedRouter history={history} context={ReactReduxContext}>
          <BrowserRouter basename={UP_STAGE}>
            <Route component={AuthProvider} path='/' exact />
            {
              pages.map(({ component: Component, ...rest }) =>
                <Route
                  key={rest.path}
                  render={routeProps => (
                    <Component
                      {...routeProps}
                      {...props}
                      onDismiss={onDismiss}
                    />
                  )}
                  {...rest}
                />
              )
            }
          </BrowserRouter>
        </ConnectedRouter>
      </Provider>
    </SnackbarProvider>
  )
}


;(async () => {
  ReactDOM.render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <ThemeProvider>
          <OfflineNotification>
            <App />
          </OfflineNotification>
        </ThemeProvider>
      </ApolloProvider>
    </React.StrictMode>,
    document.getElementById('root')
  )
})();
