// @flow
import React from 'react'
import propTypes from 'prop-types'
import Button from 'antd/lib/button'
import ProfileUserFormKeyInput from '../ProfileUserFormKeyInput'
import classes from './styles.scss'
import Input from 'antd/lib/input'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'

const UserForm = props => {
  const email = props?.user?.data?.user?.email || ''
  const name = props?.user?.data?.user?.name || ''

  return (
    <div className={props.className}>
      <Row gutter={8}>
        <Col span={12}>
          <Input
            className={classes.input}
            placeholder='Name'
            value={name}
            onChange={(e) => props.handleChange(e, 'name')}
          />
        </Col>
        <Col span={12}>
          <Input
            className={classes.input}
            placeholder='Email'
            value={email}
            onChange={(e) => props.handleChange(e, 'email')}
          />
        </Col>
      </Row>
      <ProfileUserFormKeyInput {...props} />
      <div className={classes.flex}>
        <Button
          className={classes.button}
          type={'primary'}
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
