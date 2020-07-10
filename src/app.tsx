import * as React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider, useQuery } from '@apollo/client'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import { Provider, ReactReduxContext } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { SnackbarProvider } from 'notistack'
import { OfflineNotification } from './lib/withConnectivity'
import client from './lib/client'
import { store, history } from './store'
import pages from './pages'
import { ThemeProvider } from './lib/theme'
import {  USER_QUERY, IS_LOGGED_IN } from './graphql/queries'
import Login from './containers/Login'

const UP_STAGE = process.env.UP_STAGE || undefined

function AuthedApp (props) {
  const notistackRef = React.createRef()
  const authQuery =  useQuery(IS_LOGGED_IN)
  const rootQuery = useQuery(USER_QUERY, {
    skip: !authQuery.data.isLoggedIn
  })

  const onDismiss = (key) => {
    // @ts-ignore
    notistackRef.current.closeSnackbar(key)
  }

  React.useEffect(() => {
    if (authQuery.data.isLoggedIn) {
      history.push('/dashboard') 
    } else {
      history.push('/login')
    }
  }, [authQuery])

  return (
    <SnackbarProvider maxSnack={3} ref={notistackRef} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
      <Switch>
        <Route component={Login} path='/login' exact />
        {
          pages.map(({ component: Component, ...rest }) =>
            <Route
              key={rest.path}
              render={routeProps => (
                <Component
                  {...routeProps}
                  {...props}
                  onDismiss={onDismiss}
                  rootQuery={rootQuery}
                />
              )}
              {...rest}
            />
          )
        }
       <Redirect to='/posts' />
      </Switch>
    </SnackbarProvider>
  )
}

function App (props) {
  return (
    <Provider store={store} context={ReactReduxContext}>
      <ConnectedRouter history={history} context={ReactReduxContext}>
        <BrowserRouter basename={UP_STAGE}>
          <Route component={AuthedApp} path='/' />
        </BrowserRouter>
      </ConnectedRouter>
    </Provider>
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
