import React from 'react'
import propTypes from 'prop-types'
import ProfileUserFormKeyInput from '../ProfileUserFormKeyInput'
import Input from '../Input'
import {
  Grid
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import Button from '../Button'

const useStyles = makeStyles(theme => ({
  container: {
    margin: '2em auto 1em auto',
    padding: 40,
    maxWidth: 960,
    backgroundColor: '#fff',
    borderRadius: 0,
    boxShadow: theme.variables.shadow1
  },
  input: {
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

function UserForm (props) {
  const classes = useStyles(props)
  const {
    onCopy,
    setRef,
    generateToken
  } = props
  const [user] = props?.users?.data?.users || []
  const {
    secret = '',
    email = '',
    name = '',
    id
  } = user
  return (
    <div className={props.className}>
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <Input
            className={classes.input}
            placeholder='Name'
            value={name}
            onChange={(e) => props.handleChange(e, 'name')}
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            className={classes.input}
            placeholder='Email'
            value={email}
            onChange={(e) => props.handleChange(e, 'email')}
          />
        </Grid>
      </Grid>
      <ProfileUserFormKeyInput
        onCopy={onCopy}
        setRef={setRef}
        generateToken={generateToken}
        value={secret}
      />
      <div className={classes.flex}>
        <Button
          className={classes.button}
          color='default'
          // loading={props.updateUser.loading}
          onClick={() => {
            props.updateUser.mutate({
              name: name,
              email: email,
              id: id
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

export default UserForm
