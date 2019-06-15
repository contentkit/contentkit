import React from 'react'
import { render } from 'react-dom'
import { ApolloProvider, Query, withApollo, compose } from 'react-apollo'
import { BrowserRouter, Route } from 'react-router-dom'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { Provider } from 'react-redux'

import withConnectivity from './lib/withConnectivity'
import createClient from './lib/client'
import { store } from './lib/redux'
import theme from './lib/theme'
import pages from './pages'
import { USER_QUERY } from './graphql/queries'
import './css/style.scss'
import 'antd/dist/antd.css'

const client = createClient()

const UP_STAGE = process.env.UP_STAGE || undefined

const App = props => (
  <Provider store={store}>
    <BrowserRouter basename={UP_STAGE}>
      <MuiThemeProvider theme={theme}>
        <React.Suspense fallback={<div />}>
          {
            pages.map(({ component: Component, ...rest }) =>
              <Route
                key={rest.path}
                render={routeProps => <Component {...routeProps} {...props} />}
                {...rest}
              />
            )
          }
        </React.Suspense>
      </MuiThemeProvider>
    </BrowserRouter>
  </Provider>
)

const withRootQuery = Component => props => (
  <Query query={USER_QUERY}>
    {(user) => <Component {...props} user={user} />}
  </Query>
)

const ConnectedApp = compose(
  withApollo,
  withRootQuery,
  withConnectivity
)(App)

render(
  <ApolloProvider client={client}>
    <ConnectedApp />
  </ApolloProvider>,
  document.getElementById('root')
)
