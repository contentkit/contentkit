import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { CircularProgress } from '@material-ui/core'
import { ApolloProvider, useQuery } from '@apollo/client'
import { BrowserRouter, Route, Redirect } from 'react-router-dom'
import { Provider } from 'react-redux'

import { OfflineNotification } from './lib/withConnectivity'
import client from './lib/client'
import { store } from './store'
import pages from './pages'
import './css/style.scss'
import Progress from './components/Progress'
import { ThemeProvider } from './lib/theme'
import { USER_QUERY, USER_AUTH_QUERY } from './graphql/queries'

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
    <Provider store={store}>
      <BrowserRouter basename={UP_STAGE}>
        <React.Suspense fallback={<Progress />}>
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
        </React.Suspense>
      </BrowserRouter>
    </Provider>
  )
}


;(async () => {
  ReactDOM.render(
    <ApolloProvider client={client}>
      <ThemeProvider>
        <OfflineNotification>
          <App />
        </OfflineNotification>
      </ThemeProvider>
    </ApolloProvider>,
    document.getElementById('root')
  )  
})();
