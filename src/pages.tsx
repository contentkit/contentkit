import React from 'react'
import Dashboard from './containers/Dashboard'
import Login from './containers/Login'
import PostEditor from './containers/PostEditor'
import Projects from './containers/Projects'
import Profile from './containers/Profile'
import Tags from './containers/Tags'
import Migrations from './containers/Migrations'

// export const Dashboard = React.lazy(() => import('./containers/Dashboard'))
// export const SignIn = React.lazy(() => import('./containers/Login'))
// export const PostEditor = React.lazy(() => import('./containers/PostEditor'))
// export const Projects = React.lazy(() => import('./containers/Projects'))
// export const Profile = React.lazy(() => import('./containers/Profile'))

export default [{
  component: Dashboard,
  path: '/posts',
  exact: true
}, {
  component: Profile,
  path: '/profile',
  exact: true
}, {
  component: PostEditor,
  path: '/posts/:id',
  exact: true
}, {
  component: Projects,
  path: '/projects',
  exact: true
}, {
  component: Tags,
  path: '/tags',
  exact: true 
}, {
  component: Migrations,
  path: '/migrations',
  exact: true
}]
