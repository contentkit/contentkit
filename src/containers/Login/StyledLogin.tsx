import React from 'react'
import PropTypes from 'prop-types'
import { 
  Grid,
  Tabs,
  Tab,
  InputAdornment,
  IconButton,
  Snackbar,
  Box
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { Visibility, VisibilityOff } from '@material-ui/icons'
import Button from '../../components/Button'
import { Input } from '@contentkit/components'
import { useAuthenticateUser, useRegisterUser } from './mutations'
import { useUserQuery } from '../../graphql/queries'
import useStyles from './styles'
import PasswordField from './components/PasswordField'
import { withRouter } from 'react-router-dom'

const useLoginStyles = makeStyles(theme => ({
  root: {
    [`${theme.breakpoints.up('md')} and (-webkit-max-device-pixel-ratio: 2)`]: {
      fontSize: 14
    },
    [`${theme.breakpoints.down('md')}`]: {
      fontSize: 20
    },
    ['@media (pointer: coarse)']: {
      fontSize: 20
    }
  }
}))

function LoginContainer (props) {
  const { children, classes } = props
  return (
    <div className={classes.container}>
      <div className={classes.inset}>
        {children}
      </div>
    </div>
  )
}

function SignInEmailTextField (props) {
  const { value, onChange } = props
  return (
    <Input
      id='email'
      placeholder='Email'
      value={value}
      onChange={onChange}
      type={'email'}
      autoComplete={'username'}
    />
  )
}

function LoginTabs (props) {
  const { value, onChange, className } = props
  return (
    <Tabs
      value={value}
      onChange={onChange}
      className={className}
    >
      <Tab label={'Login/Register'} key={0} value={0} />
      <Tab label={'Reset Password'} key={1} value={1} />
    </Tabs>
  )
}

function Login (props) {
  const { history } = props
  const user = useUserQuery()
  const classes = useStyles(props)
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [tab, setTab] = React.useState(0)
  const [passwordResetSent, setPasswordResetSent] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [errors, setErrors] = React.useState([])
  const [snackbarOpen, setSnackbarOpen] = React.useState(false)

  const authenticateUser = useAuthenticateUser()
  const registerUser = useRegisterUser()

  const onCloseSnackbar = () => setSnackbarOpen(false)
  
  const handleTabChange = (evt, value) => {
    setTab(value)
  }

  const redirect = () => {
    history.push('/')
  }

  React.useEffect(() => {
    console.log(errors)
    if (errors.length) {
      setSnackbarOpen(true)
    }
  }, [errors])

  React.useEffect(() => {
    if (user?.data?.users?.length) {
      redirect()
    }
  }, [user])

  const login = async () => {
    setLoading(true)
    try {
      await authenticateUser({
        email,
        password
      })
    } catch (err) {
      setErrors(err.graphQLErrors)
    }
  }


  const createAccount = async () => {
    setLoading(true)
    try {
      await registerUser({
        email,
        password
      })
    } catch (err) {
      setErrors(err.graphQLErrors)
    }
  }

  const resetPassword = () => {}

  const emailOnChange = evt => setEmail(evt.target.value)

  const passwordOnChange = evt => setPassword(evt.target.value)

  const { title, backgroundImage } = props
  const showLogin = tab === 0
  return (
    <LoginContainer classes={classes}>
      <Snackbar
        open={snackbarOpen}
        message={errors.length ? errors[0].message : null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        autoHideDuration={6000}
        onClose={onCloseSnackbar}
      />
      <div className={classes.left}>
        <div className={classes.content}>
          <div className={classes.title}>
            {title}
          </div>
          <LoginTabs className={classes['gutter-40']} value={tab} onChange={handleTabChange} />
          {passwordResetSent && (
            <Grid>
              Password reset email sent!
            </Grid>
          )}
          <form>
            <Box mb={2}>
              <SignInEmailTextField
                value={email}
                onChange={emailOnChange}
              />
            </Box>
            <Box mb={2}>
              {showLogin
                ? <PasswordField
                    value={password}
                    onChange={passwordOnChange}
                  />
                : <div className={classes.spacer} />
              }
            </Box>
          </form>
          <Grid container>
            {showLogin ? (
              <React.Fragment>
                <Grid item xs={4}>
                  <Button
                    onClick={login}
                    size='large'
                  >
                    Login
                  </Button>
                </Grid>
                <Grid item xs={4}>
                  <Button
                    size='large'
                    onClick={createAccount}
                  >
                    Sign Up
                  </Button>
                </Grid>
              </React.Fragment>
            ) : (
              <Grid item>
                <Button onClick={resetPassword} size={'large'}>Reset</Button>
              </Grid>
            )}
          </Grid>
        </div>
      </div>
      <div className={classes.right} />
    </LoginContainer>
  )
}

export default withRouter(Login)

