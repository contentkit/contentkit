// @flow
import React from 'react'
import propTypes from 'prop-types'
import Button from 'antd/lib/button'
import ProfileUserFormKeyInput from '../ProfileUserFormKeyInput'
import classes from './styles.scss'
import Input from 'antd/lib/input'

const UserForm = props => {
  const email = props?.user?.data?.user?.email || ''
  const name = props?.user?.data?.user?.name || ''

  return (
    <div className={classes.container}>
      <Input
        placeholder='Name'
        value={name}
        onChange={(e) => props.handleChange(e, 'name')}
      />
      <Input
        placeholder='Email'
        value={email}
        onChange={(e) => props.handleChange(e, 'email')}
      />
      <ProfileUserFormKeyInput {...props} />
      <div className={classes.flex}>
        <Button
          className={classes.button}
          onClick={() => props.generateToken()}
        >
          Generate Token
        </Button>
        <Button
          className={classes.button}
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

UserForm.defaultProps = {}

UserForm.propTypes = {
  user: propTypes.object,
  updateUser: propTypes.func.isRequired,
  handleChange: propTypes.func.isRequired,
  generateToken: propTypes.func.isRequired
}

export default UserForm
