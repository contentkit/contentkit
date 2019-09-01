// @flow
import React from 'react'
import PropTypes from 'prop-types'
import RightNav from './RightNav'
import { Link } from 'react-router-dom'
import { PROFILE_PATH, LOGIN_PATH, PROJECTS_PATH } from '../../lib/config'
import Layout from 'antd/lib/layout'

import styles from './styles.scss'

const createNavBarOptions = (props) => {
  const defaultOptions = [{
    label: 'Login/Sign Up',
    onClick: e => props.history.replace(LOGIN_PATH)
  }]

  const loggedOptions = [{
    label: 'Projects',
    onClick: e => props.history.replace(PROJECTS_PATH)
  }, {
    label: 'Account',
    onClick: e => props.history.replace(PROFILE_PATH)
  }, {
    label: 'Sign out',
    onClick: e => {
      window.localStorage.removeItem('token')
      props.client.resetStore()
      props.history.replace('/login')
    }
  }]

  return props.logged ? loggedOptions : defaultOptions
}

function Header (props) {
  const { ...rest } = props /* eslint-disable-line */
  const options = createNavBarOptions(props)
  return (
    <Layout.Header className={styles.root}>
      <Link to='/' className={styles.flex}>
        <div className={styles.brand}>
          ContentKit
        </div>
      </Link>
      <RightNav
        render={props.render}
        options={options}
        query={props.query}
      />
    </Layout.Header>
  )
}

Header.propTypes = {
  history: PropTypes.object.isRequired,
  render: PropTypes.func,
  navbar: PropTypes.object,
  logged: PropTypes.bool.isRequired
}

Header.defaultProps = {
  render: () => null
}

export default Header
