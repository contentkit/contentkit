import React from 'react'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import EnhancedInput from '../EnhancedInput'

class PasswordField extends React.Component {
  state = {
    password: '',
    showPassword: false
  }

  handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  handleClickShowPasssword = () => {
    this.setState({ showPassword: !this.state.showPassword })
  }

  renderAdornment = () => (
    <IconButton
      color='primary'
      onClick={this.handleClickShowPasssword}
      onMouseDown={this.handleMouseDownPassword}
    >
      {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
    </IconButton>
  )

  render () {
    return (
      <div>
        <EnhancedInput
          label='password'
          type={this.state.showPassword ? 'text' : 'password'}
          adornment={this.renderAdornment()}
          {...this.props}
        />
      </div>
    )
  }
}

PasswordField.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string
}

export default PasswordField
