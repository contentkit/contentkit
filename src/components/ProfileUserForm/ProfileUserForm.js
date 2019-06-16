// @flow
import React from 'react'
import propTypes from 'prop-types'
import Button from 'antd/lib/button'
import ProfileUserFormKeyInput from '../ProfileUserFormKeyInput'
import EnhancedInput from '../EnhancedInput'
import classes from './styles.scss'

const UserForm = props => {
  let email = props?.user?.data?.user?.email || ''
  let name = props?.user?.data?.user?.name || ''

  return (
    <div className={classes.container}>
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
      <div className={classes.flex}>
        <Button
          className={classes.button}
          variant='outlined'
          color='secondary'
          onClick={() => props.generateToken()}
        >
          Generate Token
        </Button>
        <Button
          className={classes.button}
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

export default UserForm
