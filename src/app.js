import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { ApolloProvider, withApollo, compose } from 'react-apollo'
import { BrowserRouter, Route } from 'react-router-dom'
import { Provider } from 'react-redux'

import withConnectivity from './lib/withConnectivity'
import createClient from './lib/client'
import { store } from './lib/redux'
import pages from './pages'
import './css/style.scss'
import Fallback from './components/Fallback'
import AuthProvider from './components/AuthProvider'
import { ThemeProvider } from './lib/theme'

const client = createClient()

const UP_STAGE = process.env.UP_STAGE || undefined

const App = (props) => (
  <Provider store={store}>
    <BrowserRouter basename={UP_STAGE}>
      <React.Suspense fallback={<Fallback />}>
        {
          pages.map(({ component: Component, ...rest }) =>
            <Route
              key={rest.path}
              render={routeProps => (
                <AuthProvider>
                  <Component
                    {...routeProps}
                    {...props}
                  />
                </AuthProvider>
              )}
              {...rest}
            />
          )
        }
      </React.Suspense>
    </BrowserRouter>
  </Provider>
)

const ConnectedApp = compose(
  withApollo,
  withConnectivity
)(App)

;(async () => {
  ReactDOM.render(
    <ApolloProvider client={client}>
      <ThemeProvider>
        <ConnectedApp />
      </ThemeProvider>
    </ApolloProvider>,
    document.getElementById('root')
  )  
})();
