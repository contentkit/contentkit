// @flow
import React from 'react'
import propTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import ApiKeyInput from '../ProfileUserFormKeyInput'
import { withStyles } from '@material-ui/core/styles'
import EnhancedInput from '../EnhancedInput'

const UserForm = props => {
  return (
    <div className={props.classes.container}>
      <EnhancedInput
        fullWidth
        id='name'
        placeholder='Name'
        value={props.name}
        onChange={(e) => props.handleChange(e, 'name')}
      />
      <EnhancedInput
        fullWidth
        id='email'
        placeholder='Email'
        value={props.email}
        onChange={(e) => props.handleChange(e, 'email')}
      />
      <ApiKeyInput {...props} />
      <div>
        <Button
          variant='raised'
          color='primary'
          onClick={() => {
            props.updateUser({
              name: props.name,
              id: props.id,
              email: props.email
            })
          }}
        >
          Update
        </Button>
      </div>
    </div>
  )
}

UserForm.defaultProps = {
  name: '',
  id: '',
  email: ''
}

UserForm.propTypes = {
  name: propTypes.string,
  id: propTypes.string,
  email: propTypes.string,
  updateUser: propTypes.func.isRequired,
  handleChange: propTypes.func.isRequired
}

export default withStyles(
  theme => ({
    container: {
      maxWidth: '500px',
      margin: '2em auto 1em auto',
      backgroundColor: '#fff',
      padding: '2em'
    },
    formControl: {
      width: '100%'
    },
    iconButton: {
      color: '#4c6072'
    },
    input: {
      padding: '2px 8px',
      color: '#4c6072',
      height: '100%'
    }
  })
)(UserForm)
