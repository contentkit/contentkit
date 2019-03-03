import React from 'react'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormControl from '@material-ui/core/FormControl'
import { withStyles } from '@material-ui/core/styles'

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

  render () {
    const { classes, value, onChange } = this.props
    const { reveal } = this.state
    return (
      <div>
        <FormControl fullWidth>
          <Input
            id='password'
            type={reveal ? 'text' : 'password'}
            value={value}
            onChange={onChange}
            disableUnderline
            placeholder='Password'
            autoComplete={'current-password'}
            className={classes.root}
            endAdornment={
              <InputAdornment
                position='end'
                style={{ margin: 0 }}
              >
                <IconButton
                  onClick={this.reaveal}
                  onMouseDown={this.handleReveal}
                >
                  {reveal
                    ? <VisibilityOff />
                    : <Visibility />
                  }
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </div>
    )
  }
}

PasswordField.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string
}

export default withStyles(
  theme => ({
    root: {
      padding: '5px 5px 5px 13px',
    }
  })
)(PasswordField)
