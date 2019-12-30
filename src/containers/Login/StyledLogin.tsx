import React from 'react'
import PropTypes from 'prop-types'
import { 
  Grid,
  Tabs,
  Tab,
  InputAdornment,
  IconButton
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { Visibility, VisibilityOff } from '@material-ui/icons'
import Button from '../../components/Button'
import { Input } from '@contentkit/components'
import { useAuthenticateUser, useRegisterUser } from './mutations'

const useStyles = makeStyles(theme => ({
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
    [theme.breakpoints.down('md')]: {
      display: 'none'
    },
    [theme.breakpoints.up('md')]: {
      backgroundClip: 'border-box',
      width: 'calc(100% - 400px)',
      overflowY: 'hidden'
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
}))

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
    />
  )
}

function PasswordField (props) {
  const [show, setShow] = React.useState(null)

  const toggleReveal = () => setShow(show => !show)

  const onMouseDown = evt => {
    evt.preventDefault()
  }

  const {
    onChange,
    value
  } = props
  return (
    <Input
      placeholder={'Password'}
      onChange={onChange}
      value={value}
      type={show ? 'text' : 'password'}
      endAdornment={
        <InputAdornment position='end'>
          <IconButton
            aria-label='toggle password visibility'
            onClick={toggleReveal}
            onMouseDown={onMouseDown}
          >
            {show ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      }
    />
  )

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

function Login (props) {
  const {
    user,
    history,
    renderLoading,
  } = props
  const classes = useStyles(props)
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [tab, setTab] = React.useState(0)
  const [passwordResetSent, setPasswordResetSent] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const authenticateUser = useAuthenticateUser()
  const registerUser = useRegisterUser()

  const handleTabChange = (evt, value) => {
    setTab(value)
  }


  const redirect = () => {
    history.push('/')
  }

  React.useEffect(() => {
    if (user) {
      redirect()
    }
  }, [])

  const login = async () => {
    setLoading(true)
    await authenticateUser({
      email,
      password
    })
  }


  const createAccount = async () => {
    setLoading(true)
    await registerUser({
      email,
      password
    })
  }

  const resetPassword = () => {}

  const emailOnChange = evt => setEmail(evt.target.value)

  const passwordOnChange = evt => setPassword(evt.target.value)

  const { title, backgroundImage } = props
  const showLogin = tab === 0
  return (
    <div className={classes.container}>
      <div className={classes.inset}>
        <div className={classes.left}>
          <div className={classes.content}>
            <div className={classes.title}>
              {title}
            </div>
            <LoginTabs className={classes['gutter-40']} value={tab} handleTabChange={handleTabChange} />
            {passwordResetSent && (
              <Grid>
                Password reset email sent!
              </Grid>
            )}
            <div className={classes['gutter-20']}>
              <SignInEmailTextField
                value={email}
                onChange={emailOnChange}
              />
            </div>
            
            <div className={classes['gutter-40']}>
              {showLogin
                ? <PasswordField
                    value={password}
                    onChange={passwordOnChange}
                  />
                : <div className={classes.spacer} />
              }
            </div>
            <Grid container>
              {showLogin ? (
                <React.Fragment>
                  <Grid item xs={4}>
                    <Button
                      onClick={login}
                      size={'large'}
                      type={'primary'}
                    >
                      Login {loading ? renderLoading({}) : ''}
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      size={'large'}
                      onClick={createAccount}
                    >
                      Sign Up
                    </Button>
                  </Grid>
                </React.Fragment>
              ) : (
                <Grid item>
                  <Button onClick={resetPassword} type={'primary'} size={'large'}>Reset</Button>
                </Grid>
              )}
            </Grid>
          </div>
        </div>
        <div className={classes.right} />
      </div>
    </div>
  )
}

export default Login

