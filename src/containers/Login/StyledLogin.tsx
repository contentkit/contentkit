import React from 'react'
import { 
  Grid,
  Tabs,
  Tab,
  Box,
  Paper,
  Fade,
  CircularProgress
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import Button from '../../components/Button'
import { useAuthenticateUser, useRegisterUser } from './mutations'
import { useUserQuery } from '../../graphql/queries'
import useStyles from './styles'
import LoginField from './components/LoginField'
import { withRouter } from 'react-router-dom'

import { useSnackbar } from 'notistack'

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
  const user = useUserQuery({
    skip: !window.localStorage.getItem('token')
  })
  const { enqueueSnackbar } = useSnackbar()
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
    history.push('/posts')
  }

  const login = async () => {
    setLoading(true)
    try {
      await authenticateUser({ email, password })
    } catch (err) {
      console.log({ err })
      setLoading(false)
      return err.graphQLErrors.forEach(e => enqueueSnackbar(e.message, { variant: 'error' }))
    }

    redirect()
  }


  const createAccount = async () => {
    setLoading(true)
    try {
      await registerUser({
        email,
        password
      })
    } catch (err) {
      setLoading(false)
      return err.graphQLErrors.forEach(e => enqueueSnackbar(e.message, { variant: 'error' }))
    }
  
    redirect()
  }

  const resetPassword = () => {}

  const emailOnChange = evt => setEmail(evt.target.value)

  const passwordOnChange = evt => setPassword(evt.target.value)

  const { title } = props
  const showLogin = tab === 0
  return (
    <LoginContainer classes={classes}>
      <Paper className={classes.paper}>
        <Fade in={loading} unmountOnExit mountOnEnter>
          <div className={classes.progress}>
            <CircularProgress />
          </div>
        </Fade>
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
          <div>
            <Box mb={2}>
              <LoginField
                value={email}
                onChange={emailOnChange}
                variant='login'
              />
            </Box>
            <Box mb={2}>
              {showLogin
                ? <LoginField
                    value={password}
                    onChange={passwordOnChange}
                    variant='password'
                  />
                : <div className={classes.spacer} />
              }
            </Box>
          </div>
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
      </Paper>
    </LoginContainer>
  )
}

Login.defaultProps = {
  title: 'ContentKit'
}


export default withRouter(Login)

