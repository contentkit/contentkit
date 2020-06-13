import React from 'react'

export const Dashboard = React.lazy(() => import('./containers/Dashboard'))
export const SignIn = React.lazy(() => import('./containers/Login'))
export const PostEditor = React.lazy(() => import('./containers/PostEditor'))
export const Projects = React.lazy(() => import('./containers/Projects'))
export const Profile = React.lazy(() => import('./containers/Profile'))

export default [{
  component: Dashboard,
  path: '/dashboard',
  exact: true
}, {
  component: Profile,
  path: '/profile',
  exact: true
}, {
  component: SignIn,
  path: '/login',
  exact: true
}, {
  component: PostEditor,
  path: '/posts/:id',
  exact: true
}, {
  component: Projects,
  path: '/projects',
  exact: true
}]
