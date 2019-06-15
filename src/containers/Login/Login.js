// @flow
import React from 'react'
import PropTypes from 'prop-types'
import PasswordField from '../../components/LoginPasswordField'
import ButtonWithSpinner from '../../components/ButtonWithSpinner'
import ErrorSnackBar from '../../components/LoginErrorSnackBar'
import { withStyles } from '@material-ui/core/styles'
import { styles } from './styles'
import TextField from '@material-ui/core/TextField'

const getErrors = ({ error }) => {
  return (error && error.graphQLErrors || []).map(err => err.message).join(', ') /* eslint-disable-line */
}

class LoginPage extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    create: PropTypes.object,
    signin: PropTypes.object
  }

  state = {
    email: '',
    password: '',
    error: undefined
  }

  static getDerivedStateFromProps (nextProps, nextState) {
    const { signin, create } = nextProps
    const error = signin.error || create.error || undefined
    if (error) {
      return { error: getErrors({ error }) }
    }
    return null
  }

  signin = () => this.props.signin.mutate({
    email: this.state.email,
    password: this.state.password
  }).then(() => {
    this.props.history.replace('/')
  })

  createAccount = () => this.props.create.mutate({
    email: this.state.email,
    password: this.state.password
  }).then(() => {
    this.props.history.replace('/')
  })

  handleEmailChange = ({ currentTarget }) => {
    this.setState({ email: currentTarget.value })
  }

  handlePasswordChange = ({ currentTarget }) => {
    this.setState({ password: currentTarget.value })
  }

  render () {
    const {
      classes,
      signin,
      create
    } = this.props
    const { error } = this.state
    console.log(this.props)
    return (
      <div className={classes.container}>
        <ErrorSnackBar open={Boolean(error)}
          errorMessage={error}
        />
        <div className={classes.inset}>
          <div className={classes.left}>
            <form className={classes.login}>
              <h4 className={classes.title}>ContentKit</h4>
              <div className={classes.gutter}>
                <TextField
                  id='email'
                  placeholder='Email'
                  margin='normal'
                  InputProps={{
                    disableUnderline: true,
                    className: classes.input
                  }}
                  value={this.state.email}
                  onChange={this.handleEmailChange}
                  type={'email'}
                  autoComplete={'username'}
                  fullWidth
                  className={classes.textField}
                />
                <PasswordField
                  id='password'
                  fullWidth
                  value={this.state.password}
                  onChange={this.handlePasswordChange}
                  placeholder='Password'
                  margin='normal'
                  autoComplete='current-password'
                />
              </div>
              <div className={classes.row}>
                <ButtonWithSpinner
                  className={classes.button}
                  fullWidth
                  loading={signin.loading}
                  variant='outlined'
                  color='secondary'
                  id='submit-login'
                  onClick={this.signin}
                >
                  Sign in
                </ButtonWithSpinner>
                <ButtonWithSpinner
                  className={classes.button}
                  fullWidth
                  loading={create.loading}
                  variant='contained'
                  color='primary'
                  onClick={this.createAccount}
                >
                    Create account
                </ButtonWithSpinner>
              </div>
            </form>
          </div>
          <div className={classes.right}></div>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(LoginPage)
