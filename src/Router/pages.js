import React from 'react'
import { withAsync } from 'with-async-component'
import Spinner from '../components/Spinner'
import { Redirect } from 'react-router-dom'

const styles = {
  width: '100%',
  minHeight: '100vh',
  backgroundColor: '#f4f9fd',
  position: 'absolute',
  padding: '40vh',
  boxSizing: 'border-box',
  top: 0,
  zIndex: 0,
  pointerEvents: 'none'
}

export const LoadingOverlay = ({ loading, children }) => (
  <React.Fragment>
    <div className={loading ? '' : 'fadeIn'}>
      {children}
    </div>
    <div style={{...styles}} className={loading ? '' : 'fadeOut'}>
      <Spinner />
    </div>
  </React.Fragment>
)

const shouldRedirect = props => !(props.logged || props.loading || /login/.test(window.location.pathname))

const withRedirect = Component => props =>
  shouldRedirect(props)
    ? <Redirect to='/login' />
    : <Component {...props} />

const withAsyncComponent = withAsync(LoadingOverlay)

export const Dashboard = withRedirect(withAsyncComponent(
  () => import('../containers/Dashboard'))
)

export const SignIn = withRedirect(withAsyncComponent(
  () => import('../containers/Login')
))
export const PostEditor = withRedirect(withAsyncComponent(
  () => import('../containers/PostEditor')
))
export const Projects = withRedirect(withAsyncComponent(() => import('../containers/Projects')))

export const Profile = withRedirect(withAsyncComponent(
  () => import('../containers/Profile')
))

// export const Dashboard = _Dashboard |> withAsyncComponent |> withRedirect
// export const SignIn = _SignIn |> withAsyncComponent |> withRedirect
// export const PostEditor = _PostEditor |> withAsyncComponent |> withRedirect
// export const Projects = _Projects |> withAsyncComponent |> withRedirect
// export const Playground = _Playground |> withAsyncComponent |> withRedirect
