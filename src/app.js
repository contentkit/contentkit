import * as React from 'react'
import { render } from 'react-dom'
import { ApolloProvider, withApollo, compose } from 'react-apollo'
import { BrowserRouter, Route } from 'react-router-dom'
import { Provider } from 'react-redux'

import withConnectivity from './lib/withConnectivity'
import createClient from './lib/client'
import { store } from './lib/redux'
import pages from './pages'
import 'antd/dist/antd.less'
import './css/style.scss'
import Fallback from './components/Fallback'
import AuthProvider from './components/AuthProvider'

const client = createClient()

const UP_STAGE = process.env.UP_STAGE || undefined

const App = props => (
  <Provider store={store}>
    <BrowserRouter basename={UP_STAGE}>
      <React.Suspense fallback={<Fallback />}>
        {
          pages.map(({ component: Component, ...rest }) =>
            <Route
              key={rest.path}
              render={routeProps => (
                <Component
                  {...routeProps}
                  {...props}
                  logged={Boolean(props.user?.data?.user)}
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

const ConnectedApp = compose(
  withApollo,
  withConnectivity
)(App)

render(
  <ApolloProvider client={client}>
    <AuthProvider>
      <ConnectedApp />
    </AuthProvider>
  </ApolloProvider>,
  document.getElementById('root')
)
