import React from 'react'
import withAsync from 'with-async-component'
import Spinner from '../components/Spinner'

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

export const App = withAsync(() => import('../containers/App'), LoadingOverlay)
export const Profile = withAsync(() => import('../containers/Profile'), LoadingOverlay)
export const SignIn = withAsync(() => import('../containers/SignIn'), LoadingOverlay)
export const PostEditor = withAsync(() => import('../containers/PostEditor'), LoadingOverlay)
export const Projects = withAsync(() => import('../containers/Projects'), LoadingOverlay)
export const Playground = withAsync(() => import('../containers/Playground'), LoadingOverlay)
