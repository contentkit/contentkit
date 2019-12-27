import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { ApolloProvider, useQuery } from '@apollo/react-hooks'
import { BrowserRouter, Route, Redirect } from 'react-router-dom'
import { Provider } from 'react-redux'

import withConnectivity from './lib/withConnectivity'
import createClient from './lib/client'
import { store } from './lib/redux'
import pages from './pages'
import './css/style.scss'
import Fallback from './components/Fallback'
import { ThemeProvider } from './lib/theme'
import { USER_QUERY } from './graphql/queries'

const client = createClient()

const UP_STAGE = process.env.UP_STAGE || undefined

function App (props) {
  const users = useQuery(USER_QUERY)

  if (!users.loading) {
    if (!users?.data?.users) {
      if (!props.history.location.pathname.startsWith('/login')) {
        return <Redirect to='/login' />
      }
    }
  }

  return (
    <Provider store={store}>
      <BrowserRouter basename={UP_STAGE}>
        <React.Suspense fallback={<Fallback />}>
          {
            pages.map(({ component: Component, ...rest }) =>
              <Route
                key={rest.path}
                render={routeProps => (
                  <Component
                    users={users}
                    logged={Boolean(users?.data?.users)}
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

// const ConnectedApp = compose(
//   withApollo,
//   withConnectivity
// )(App)

;(async () => {
  ReactDOM.render(
    <ApolloProvider client={client}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ApolloProvider>,
    document.getElementById('root')
  )  
})();
