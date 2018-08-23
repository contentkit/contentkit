import React from 'react'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import Visibility from '@material-ui/icons/es/Visibility'
import VisibilityOff from '@material-ui/icons/es/VisibilityOff'
import EnhancedInput from '../EnhancedInput'

class PasswordField extends React.Component {
  state = {
    password: '',
    reveal: false
  }

  reveal = (event) => {
    event.preventDefault()
  }

  handleReveal = () => {
    this.setState(prevState => ({ reveal: !prevState.reveal }))
  }

  renderAdornment = () => (
    <IconButton
      color='primary'
      onClick={this.handleReveal}
      onMouseDown={this.reveal}
    >
      {this.state.reveal ? <VisibilityOff /> : <Visibility />}
    </IconButton>
  )

  render () {
    return (
      <div>
        <EnhancedInput
          label='password'
          type={this.state.reveal ? 'text' : 'password'}
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
