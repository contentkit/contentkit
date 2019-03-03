import React from 'react'
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
    <div style={{ ...styles }} className={loading ? '' : 'fadeOut'}>
      <Spinner />
    </div>
  </React.Fragment>
)

const shouldRedirect = props => !(props.user?.loading || props.user?.data?.user || /login/.test(window.location.pathname))

const withRedirect = Component => props =>
  shouldRedirect(props)
    ? <Redirect to='/login' />
    : <Component {...props} />

export const Dashboard = withRedirect(
  React.lazy(() => import('../containers/Dashboard'))
)

export const SignIn = withRedirect(
  React.lazy(() => import('../containers/Login'))
)

export const PostEditor = withRedirect(
  React.lazy(() => import('../containers/PostEditor'))
)

export const Projects = withRedirect(
  React.lazy(() => import('../containers/Projects'))
)

export const Profile = withRedirect(
  React.lazy(() => import('../containers/Profile'))
)
