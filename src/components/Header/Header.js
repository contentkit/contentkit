// @flow
import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import RightNav from './RightNav'
import { Link } from 'react-router-dom'
import LinearProgress from '@material-ui/core/LinearProgress'
import { PROFILE_PATH, LOGIN_PATH, PROJECTS_PATH } from '../../lib/config'

const styles = {
  root: {
    flexGrow: 1
  },
  appBar: {},
  flex: {
    textDecoration: 'none',
    color: '#333'
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  spacer: {
    width: '100%',
    height: '5px'
  },
  toolbar: {
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  }
}

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

class DefaultAppBar extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.logged !== this.props.logged ||
      nextProps.loading !== this.props.loading ||
      nextProps.anchorEl !== this.props.anchorEl ||
      nextProps.selectedPost !== this.props.selectedPost ||
      nextProps.query !== this.props.query
  }

  render () {
    const { classes, ...rest } = this.props /* eslint-disable-line */
    const options = createNavBarOptions(this.props)
    return (
      <div className={classes.root}>
        <AppBar position='static' elevation={0} className={classes.appBar}>
          {this.props.loading ? <LinearProgress /> : <div className={classes.spacer} />}
          <Toolbar className={classes.toolbar}>
            <Link to='/' className={classes.flex}>
              <Typography variant='title' style={{color: '#fff'}}>
                ContentKit
              </Typography>
            </Link>
            <RightNav
              anchorEl={this.props.anchorEl}
              setAnchorEl={this.props.setAnchorEl}
              render={this.props.render}
              options={options}
              query={this.props.query}
            />
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

DefaultAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object,
  loading: PropTypes.bool,
  render: PropTypes.func,
  navbar: PropTypes.object,
  logged: PropTypes.bool
}

export default withStyles(styles)(DefaultAppBar)
