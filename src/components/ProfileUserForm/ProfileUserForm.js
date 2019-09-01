import React from 'react'
import propTypes from 'prop-types'
import Button from 'antd/lib/button'
import ProfileUserFormKeyInput from '../ProfileUserFormKeyInput'
import classes from './styles.scss'
import Input from 'antd/lib/input'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Form from 'antd/lib/form'

function UserForm (props) {
  const {
    onCopy,
    setRef,
    generateToken
  } = props
  const secret = props?.user?.data?.user.secret || ''
  const email = props?.user?.data?.user?.email || ''
  const name = props?.user?.data?.user?.name || ''
  const { form: { getFieldDecorator } } = props
  return (
    <div className={props.className}>
      <Row gutter={32}>
        <Col span={12}>
          <Form.Item label={'Name'}>
            <Input
              className={classes.input}
              placeholder='Name'
              value={name}
              onChange={(e) => props.handleChange(e, 'name')}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label={'Email'}>
            <Input
              className={classes.input}
              placeholder='Email'
              value={email}
              onChange={(e) => props.handleChange(e, 'email')}
            />
          </Form.Item>
        </Col>
      </Row>
      <ProfileUserFormKeyInput
        onCopy={onCopy}
        setRef={setRef}
        generateToken={generateToken}
        value={secret}
      />
      <div className={classes.flex}>
        <Button
          className={classes.button}
          type={'primary'}
          loading={props.updateUser.loading}
          onClick={() => {
            props.updateUser.mutate({
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
  updateUser: propTypes.object.isRequired,
  handleChange: propTypes.func.isRequired,
  generateToken: propTypes.func.isRequired
}

export default Form.create('profile_user_form')(UserForm)
