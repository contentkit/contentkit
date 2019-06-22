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

class Header extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.logged !== this.props.logged ||
      nextProps.loading !== this.props.loading ||
      nextProps.selectedPost !== this.props.selectedPost ||
      nextProps.query !== this.props.query
  }

  render () {
    const { ...rest } = this.props /* eslint-disable-line */
    const options = createNavBarOptions(this.props)
    return (
      <Layout.Header className={styles.root}>
        <Link to='/' className={styles.flex}>
          <div className={styles.brand}>
            ContentKit
          </div>
        </Link>
        <RightNav
          render={this.props.render}
          options={options}
          query={this.props.query}
        />
      </Layout.Header>
    )
  }
}

Header.propTypes = {
  history: PropTypes.object,
  loading: PropTypes.bool,
  render: PropTypes.func,
  navbar: PropTypes.object,
  logged: PropTypes.bool
}

export default Header
