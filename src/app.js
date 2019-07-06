import * as React from 'react'
import { render } from 'react-dom'
import { ApolloProvider, Query, withApollo, compose } from 'react-apollo'
import { BrowserRouter, Route } from 'react-router-dom'
import { Provider } from 'react-redux'

import withConnectivity from './lib/withConnectivity'
import createClient from './lib/client'
import { store } from './lib/redux'
import pages from './pages'
import { USER_QUERY } from './graphql/queries'
import 'antd/dist/antd.less'
import './css/style.scss'
import Spinner from './components/Spinner'
import styles from './css/fallback.scss'

const client = createClient()

const UP_STAGE = process.env.UP_STAGE || undefined

function Fallback (props) {
  React.useEffect(() => {
    let start = Date.now()

    return () => {
      let end = Date.now()
      console.log(`Spend ${(end - start) / 1000}s in fallback`)
    }
  })
  return (
    <div className={styles.root}>
      <div>
        <Spinner />
      </div>
    </div>
  )
}

const App = props => (
  <Provider store={store}>
    <BrowserRouter basename={UP_STAGE}>
      <React.Suspense fallback={<Fallback />}>
        {
          pages.map(({ component: Component, ...rest }) =>
            <Route
              key={rest.path}
              render={routeProps => (
                <React.unstable_Profiler onRender={(...stats) => console.log(stats[2])}>
                  <Component
                    {...routeProps}
                    {...props}
                    logged={Boolean(props.user?.data?.user)}
                  />
                </React.unstable_Profiler>
              )}
              {...rest}
            />
          )
        }
      </React.Suspense>
    </BrowserRouter>
  </Provider>
)

const withRootQuery = Component => props => (
  <Query query={USER_QUERY}>
    {(user) => {
      return (<Component {...props} user={user} />)
    }}
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
