import React from 'react'
import { Typography, Toolbar, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    width: '100%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#2D3748',
    boxSizing: 'border-box',
    // @ts-ignore
    padding: theme.spacing(0, 2)
  },
  brand: {},
  brandText: {
    color: '#fff',
    fontWeight: 700,
    fontSize: 18
  },
  nav: {},
  button: {
    color: '#cbd5e0',
    fontWeight: 600,
    textTransform: 'inherit',
    // @ts-ignore
    marginRight: theme.spacing(2),
    '&:hover': {
      color: '#fff'
    }
  },
  active: {
    backgroundColor: '#4a5568'
  }
}))


function TopBar (props) {
  const { history } = props
  const classes = useStyles(props)
  const buttons = [
    {
      label: 'Posts',
      key: 'posts',
      pathname: '/dashboard'
    },
    {
      label: 'Projects',
      key: 'projects',
      pathname: '/projects'
    }
  ]
  const onClick = button => evt => {
    history.push(button.pathname)
  }

  return (
    <div className={classes.root}>
      <Toolbar className={classes.brand} variant='dense'>
        <Typography className={classes.brandText}>ContentKit</Typography>
      </Toolbar>
      <Toolbar className={classes.nav} variant='dense'>
        {
          buttons.map(button => {
            const active = history.location.pathname == button.pathname
            return (
              <Button key={button.key} classes={{ root: clsx(classes.button, { [classes.active]: active }) }} onClick={onClick(button)}>{button.label}</Button>
            )
          })
        }
      </Toolbar>
    </div>
  )
}

export default TopBar
