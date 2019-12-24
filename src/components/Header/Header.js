import React from 'react'
import PropTypes from 'prop-types'
import RightNav from './RightNav'
import { Link } from 'react-router-dom'
import { PROFILE_PATH, LOGIN_PATH, PROJECTS_PATH } from '../../lib/config'
import { makeStyles } from '@material-ui/styles'
import { Drawer } from '@material-ui/core'

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
    label: 'Login',
    onClick: e => {
      window.localStorage.removeItem('token')
      props.client.resetStore()
      props.history.replace('/login')
    }
  }]

  return props.logged ? loggedOptions : defaultOptions
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    padding: '0 30px',
    backgroundColor: '#161616',
    borderBottom: '1px solid #393939',
    // zIndex: 2,
    // position: 'fixed',
    // top: 0,
    // left: 0,
    // bottom: 0,
    // width: 60,
    // flexDirection: 'column'
  },
  [theme.breakpoints.up('md')]: {
    root: {
      boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.06)'
    }
  },
  flex: {
    flexBasis: '50%',
    textDecoration: 'none'
  },
  brand: {
    color: '#fff',
    // color: theme.palette.grey['900']
  },
  drawer: {
    width: 60,
    backgroundColor: '#161616',
    flexDirection: 'column',
    alignItems: 'center'
  }
}))

function Header (props) {
  const classes = useStyles(props)
  const options = createNavBarOptions(props)
  // return (
  //   <Drawer variant='permanent' classes={{ paper: classes.drawer }}>
  //     <Link to='/' className={classes.flex}>
  //       <div className={classes.brand}>
  //         CK
  //       </div>
  //     </Link>
  //   </Drawer>
  // )
  return (
    <div className={classes.root}>
      <Link to='/' className={classes.flex}>
        <div className={classes.brand}>
          ContentKit
        </div>
      </Link>
      <RightNav
        render={props.render}
        options={options}
        query={props.query}
      />
    </div>
  )
}

Header.propTypes = {
  history: PropTypes.object.isRequired,
  render: PropTypes.func,
  navbar: PropTypes.object,
  logged: PropTypes.bool
}

Header.defaultProps = {
  logged: true,
  render: () => null
}

export default Header
