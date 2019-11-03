import React from 'react'
import PropTypes from 'prop-types'
import { 
  Grid,
  Tabs,
  Tab,
  InputAdornment,
  IconButton
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';
import { Visibility, VisibilityOff } from '@material-ui/icons'

import Button from '../../components/Button'
import Input from '../../components/Input'

const styles = theme => ({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f4f4f4',
    position: 'absolute',
    boxSizing: 'border-box',
    color: '#41404F',
    fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol',
    fontSize: '14px',
    lineHeight: 1.5,
    [theme.breakpoints.up('sm')]: {
      padding: '8%'
    }
  },
  inset: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    placeContent: 'center space-between',
    backgroundColor: '#fff'
  },
  left: {
    padding: '100px 40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    boxSizing: 'border-box',
    [theme.breakpoints.down('md')]: {
      width: '100%'
    },
    [theme.breakpoints.up('md')]: {
      width: 400
    }
  },
  right: {
    backgroundColor: '#393939',
    // borderTop: '3px solid #0f62fe',
    [theme.breakpoints.down('md')]: {
      display: 'none'
    },
    [theme.breakpoints.up('md')]: {
      backgroundClip: 'border-box',
      width: 'calc(100% - 400px)',
      overflowY: 'hidden'
      // backgroundColor: '#ECEDF9',
      // 'img': {
      //   objectFit: 'contain',
      //   width: '100%',
      //   height: '100%'
      // }
    }
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    height: '100%'
  },
  button: {
    maxWidth: 160
  },
  'gutter-20': {
    marginBottom: 20
  },
  'gutter-40': {
    marginBottom: 40
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 40
  },
  spaceBetween: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  spacer: {
    height: '40px',
    width: '100%'
  }
})

function SignInEmailTextField (props) {
  return (
    <Input
      className={'input'}
      id='email'
      placeholder='Email'
      value={props.value}
      onChange={props.onChange}
      type={'email'}
      autoComplete={'username'}
      size={'large'}
    />
  )
}

class PasswordField extends React.Component {
  state = {
    show: false
  }

  toggleReveal = () => {
    this.setState(prevState => ({
      show: !prevState.show
    }))
  }

  onMouseDown = evt => {
    evt.preventDefault()
  }

  render () {
    const { show } = this.state
    return (
      <Input
        placeholder={'Password'}
        onChange={this.props.onChange}
        value={this.props.value}
        type={show ? 'text' : 'password'}
        endAdornment={
          <InputAdornment position='end'>
            <IconButton
              aria-label='toggle password visibility'
              onClick={this.toggleReveal}
              onMouseDown={this.onMouseDown}
            >
              {this.state.show ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      />
    )
  }
}

function noop () {
  return null
}

function noopPromise () {
  return Promise.resolve(undefined)
}

const LoginTabs = props => (
  <Tabs
    value={props.value}
    onChange={props.handleTabChange}
    className={props.className}
  >
    <Tab label={'Login/Register'} key={0} value={0} />
    <Tab label={'Reset Password'} key={1} value={1} />
  </Tabs>
)

class Login extends React.Component {
  static propTypes = {
    renderLoading: PropTypes.func,
    createAccount: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
    resetPassword: PropTypes.func.isRequired,
    redirectPathname: PropTypes.string.isRequired,
    title: PropTypes.node
  }

  static defaultProps = {
    renderLoading: noop,
    createAccount: noopPromise,
    login: noopPromise,
    resetPassword: noopPromise,
    redirect: noop,
    redirectPathname: '/',
    title: <div>Title</div>
  }

  state = {
    emailAddress: '',
    password: '',
    tab: 0,
    passwordResetSent: false,
    loading: false
  }

  handleTabChange = (evt, value) => {
    this.setState({ tab: value })
  }

  componentDidMount () {
    const { user } = this.props
    if (user) {
      this.redirect()
    }
  }

  login = () => {
    this.setState({ loading: true }, () => {
      this.props.login(this.state)
        .then(() => {
          this.redirect()
        })
    })
  }


  redirect = () => {
    this.props.history.push('/')
  }

  createAccount = () => {
    const { emailAddress, password } = this.state
    this.props.createAccount({ emailAddress, password })
      .then(() => this.redirect())
  }

  resetPassword = () => {
    this.props.resetPassword(this.state)
      .then(() => {
        this.setState({
          password: '',
          emailAddress: '',
          passwordResetSent: true
        })
    })
  }

  render () {
    const {
      emailAddress,
      password,
      tab,
      passwordResetSent,
      loading
    } = this.state
    const { title, backgroundImage, classes } = this.props
    const login = tab === 0
    return (
      <div className={classes.container}>
        <div className={classes.inset}>
          <div className={classes.left}>
            <div className={classes.content}>
              <div className={classes.title}>
                {title}
              </div>
              <LoginTabs className={classes['gutter-40']} value={tab} handleTabChange={this.handleTabChange} />
              {passwordResetSent && (
                <Grid>
                  Password reset email sent!
                </Grid>
              )}
              <div className={classes['gutter-20']}>
                <SignInEmailTextField
                  value={emailAddress}
                  onChange={e => this.setState({ emailAddress: e.target.value })}
                />
              </div>
              
              <div className={classes['gutter-40']}>
                {login
                  ? <PasswordField
                    value={password}
                    onChange={e => this.setState({ password: e.target.value })}
                  />
                  : <div className={classes.spacer} />
                }
              </div>
              <Grid container>
                {login ? (
                  <React.Fragment>
                  <Grid item xs={4}>
                    <Button
                      onClick={this.login}
                      size={'large'}
                      type={'primary'}
                    >
                      Login {loading ? this.props.renderLoading(this.state) : ''}
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      size={'large'}
                      onClick={this.createAccount}
                    >
                      Sign Up
                    </Button>
                  </Grid>
                  </React.Fragment>
                ) : (
                  <Grid item>
                    <Button onClick={this.resetPassword} type={'primary'} size={'large'}>Reset</Button>
                  </Grid>
                )}
              </Grid>
            </div>
          </div>
          <div className={classes.right}>
            {/* <img src={backgroundImage} /> */}
          </div>
        </div>
      </div>
    )
  }
}

const StyledLogin = withStyles(styles)(Login)

export default StyledLogin
