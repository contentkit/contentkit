// @flow
import React from 'react'
import propTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import ProfileUserFormKeyInput from '../ProfileUserFormKeyInput'
import { withStyles } from '@material-ui/core/styles'
import EnhancedInput from '../EnhancedInput'

const UserForm = props => {
  let email = props?.user?.data?.user?.email || ''
  let name = props?.user?.data?.user?.name || ''

  return (
    <div className={props.classes.container}>
      <EnhancedInput
        fullWidth
        id='name'
        placeholder='Name'
        value={name}
        onChange={(e) => props.handleChange(e, 'name')}
      />
      <EnhancedInput
        fullWidth
        id='email'
        placeholder='Email'
        value={email}
        onChange={(e) => props.handleChange(e, 'email')}
      />
      <ProfileUserFormKeyInput {...props} />
      <div className={props.classes.flex}>
        <Button
          className={props.classes.button}
          variant='contained'
          color='secondary'
          onClick={() => props.generateToken()}
        >
          Generate Token
        </Button>
        <Button
          className={props.classes.button}
          variant='contained'
          color='primary'
          onClick={() => {
            props.updateUser({
              name: name,
              email: email
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
  user: propTypes.object,
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
    },
    flex: {
      display: 'flex',
      marginLeft: -10,
      marginRight: -10
    },
    button: {
      margin: theme.spacing.unit
    }
  })
)(UserForm)
