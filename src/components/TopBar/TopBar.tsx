import React from 'react'
import { IconButton, Menu, MenuItem, Divider, Paper, Typography, Toolbar, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { MoreVert } from '@material-ui/icons'
import { withRouter } from 'react-router-dom'

import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    width: '100%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    color: '#718096',
    boxSizing: 'border-box',
    // @ts-ignore
    padding: theme.spacing(0, 2),
    zIndex: 1300,
    boxShadow: '0px 4px 8px rgba(60,45,111,0.1), 0px 1px 3px rgba(60,45,111,0.15)',
  },
  brand: {
    color: '#718096',
    fontWeight: 200,
    fontSize: 18,
    textDecoration: 'none'
  },
  nav: {},
  button: {
    backgroundColor: '#f7fafc',
    borderColor: '#718096',
    color: '#718096',
    fontWeight: 600,
    textTransform: 'inherit',
    // @ts-ignore
    marginRight: theme.spacing(2),
    '&:hover': {
    }
  },
  active: {
  },
  divider: {
    // @ts-ignore
    marginRight: theme.spacing(1)
  }
}))


function TopBar (props) {
  const { history, buttons, onClick } = props
  const [anchorEl, setAnchorEl] = React.useState(null)
  const classes = useStyles(props)
  const nativeButtons = [
    {
      label: 'Posts',
      key: 'posts',
      pathname: '/posts'
    },
    {
      label: 'Projects',
      key: 'projects',
      pathname: '/projects'
    },
    {
      label: 'Tags',
      key: 'tags',
      pathname: '/tags'
    },
    {
      label: 'Migrations',
      key: 'migrations',
      pathname: '/migrations'
    }
  ]
  const createClickHandler = button => evt => {
    history.push(button.pathname)
  }
  const onOpen = (evt) => setAnchorEl(evt.target)

  const onClose = evt => setAnchorEl(null)

  return (
    <Paper className={classes.root} elevation={2} square>
      <Toolbar variant='dense'>
        <Typography className={classes.brand} component='a' href='/posts'>
          ContentKit
        </Typography>
      </Toolbar>
      <Toolbar className={classes.nav} variant='dense'>
        {
          buttons.map(button => {
            return (
              <Button
                key={button.key}
                onClick={evt => onClick(button)}
                classes={{ root: clsx(classes.button) }}
                variant='outlined'
              >
                {button.label}
              </Button>
            )
          })
        }
        {buttons.length > 0 && (<Divider orientation='vertical' className={classes.divider} />)}
        <IconButton onClick={onOpen}>
          <MoreVert />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
          {
            nativeButtons.map(button => {
              const active = history.location.pathname == button.pathname
              return (
                <MenuItem 
                  key={button.key}
                  onClick={createClickHandler(button)}
                >
                  {button.label}
                </MenuItem>
              )
            })
          }
        </Menu>
      </Toolbar>
    </Paper>
  )
}

TopBar.defaultProps = {
  buttons: []
}

export default withRouter(TopBar)
