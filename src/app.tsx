import * as React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider, useQuery } from '@apollo/client'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Provider, ReactReduxContext } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { SnackbarProvider } from 'notistack'
import { OfflineNotification } from './lib/withConnectivity'
import client from './lib/client'
import { store, history } from './store'
import pages from './pages'
import { ThemeProvider } from './lib/theme'
import {  USER_QUERY } from './graphql/queries'
import Login from './containers/Login'
import Landing from './containers/Landing'

const UP_STAGE = process.env.UP_STAGE || undefined

function AuthedApp (props) {
  const rootQuery = useQuery(USER_QUERY)
  const notistackRef = React.createRef()

  const onDismiss = (key) => {
    // @ts-ignore
    notistackRef.current.closeSnackbar(key)
  }

  React.useEffect(() => {
    if (rootQuery.error) {
      history.push('/login') 
    }
  }, [rootQuery])

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
        <Route component={Landing} path='/' />
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
