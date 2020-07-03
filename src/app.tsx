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

  const getContent = () => {
    if (userQuery.data?.users) { 
      return (
        <Redirect to='/dashboard' />
      )
    }
  
    if (userQuery.error) {
      return (
        <Redirect to='/login' />
      )
    }
  
    return (<CircularProgress />)
  }

  return getContent()
}

function App (props) {
  return (
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
                  />
                )}
                {...rest}
              />
            )
          }
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
            <SnackbarProvider maxSnack={3}>
              <App />
            </SnackProvider>
          </OfflineNotification>
        </ThemeProvider>
      </ApolloProvider>
    </React.StrictMode>,
    document.getElementById('root')
  )
})();
