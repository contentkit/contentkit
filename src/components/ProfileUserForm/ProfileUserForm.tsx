import React from 'react'
import propTypes from 'prop-types'
import ProfileUserFormKeyInput from '../ProfileUserFormKeyInput'
import FormInput from '../FormInput'
import {
  Grid
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import Button from '../Button'

const useStyles = makeStyles((theme: any) => ({
  container: {
    margin: '2em auto 1em auto',
    padding: 40,
    maxWidth: 960,
    backgroundColor: '#fff',
    borderRadius: 0,
    boxShadow: theme.variables.shadow1
  },
  gutter: {
    marginBottom: theme.spacing(2)
  },
  flex: {
    display: 'flex',
    marginLeft: -10,
    marginRight: -10,
    justifyContent: 'flex-end'
  },
  button: {
    margin: 10
  }
}))

type UpdateUserVariables = {
  name: string,
  email: string,
  id: string
}

type UserFormProps = {
  onCopy: (evt: any) => void,
  generateToken: (evt: any) => void,
  onChange: (key: string, value: any) => void,
  updateUser: { mutate: (user: UpdateUserVariables) => void }
  className: string,
  users: any
}

const UserForm = React.forwardRef((props: UserFormProps, ref) => {
  const classes = useStyles(props)
  const {
    onCopy,
    generateToken,
    onChange,
    updateUser,
    className,
    users
  } = props
  const [user] = users?.data?.users || []
  const {
    secret = '',
    email = '',
    name = '',
    id
  } = user

  const onNameChange = evt => onChange('name', evt.target.value)
  const onEmailChange = evt => onChange('email', evt.target.value)

  const onSave = () => {
    updateUser.mutate({
      name: name,
      email: email,
      id: id
    })
  }

  return (
    <div className={className}>
      <Grid container spacing={4} className={classes.gutter}>
        <Grid item xs={6}>
          <FormInput
            placeholder='Name'
            value={name}
            onChange={onNameChange}
            label='Name'
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <FormInput
            placeholder='Email'
            value={email}
            onChange={onEmailChange}
            label='Email'
            fullWidth
          />
        </Grid>
      </Grid>
      <div className={classes.gutter}>
        <ProfileUserFormKeyInput
          onCopy={onCopy}
          ref={ref}
          generateToken={generateToken}
          value={secret}
        />
      </div>
      <div className={classes.flex}>
        <Button
          className={classes.button}
          color='default'
          onClick={onSave}
        >
          Update
        </Button>
      </div>
    </div>
  )
})

UserForm.defaultProps = {}

UserForm.propTypes = {
  // @ts-ignore
  user: propTypes.object,
  updateUser: propTypes.object.isRequired,
  onChange: propTypes.func.isRequired,
  generateToken: propTypes.func.isRequired

}

export default UserForm
