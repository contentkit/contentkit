import React from 'react'
import propTypes from 'prop-types'

import ProfileUserFormKeyInput from '../ProfileUserFormKeyInput'
import FormInput from '../FormInput'
import {
  Grid,
  Paper,
  Button,
  TextField,
  Adormentm,
  InputAdornment,
  IconButton
} from '@material-ui/core'
import { Save, Edit } from '@material-ui/icons'
import { useStyles } from './styles'

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
  const [editing, setEditing] = React.useState({
    name: false,
    email: false
  })
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

  const toggleEditing = key => evt => {
    setEditing({
      ...editing,
      [key]: !editing[key]
    })
  }

  return (
    <Paper className={className}>
      <Grid container spacing={4} className={classes.gutter}>
        <Grid item xs={6}>
          <TextField
            disabled={!editing.name}
            placeholder='Name'
            value={name}
            onChange={onNameChange}
            label='Name'
            fullWidth
            variant='outlined'
            margin='dense'
            InputProps={{
              endAdornment: (
                  <InputAdornment position='end' className={classes.adornment}>
                    <IconButton onClick={toggleEditing('name')}>
                      {editing.name ? <Save /> : <Edit />}
                    </IconButton>
                  </InputAdornment>
                )
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            disabled={!editing.email}
            placeholder='Email'
            value={email}
            onChange={onEmailChange}
            label='Email'
            fullWidth
            variant='outlined'
            margin='dense'
            InputProps={{
              endAdornment: (
                  <InputAdornment position='end' className={classes.adornment}>
                    <IconButton onClick={toggleEditing('email')}>
                      {editing.email ? <Save /> : <Edit />}
                    </IconButton>
                  </InputAdornment>
                )
            }}
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
          color='primary'
          onClick={onSave}
          variant='contained'
        >
          Update
        </Button>
      </div>
    </Paper>
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
