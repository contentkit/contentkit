import React from 'react'
import { Menu, MenuItem, Avatar, Toolbar } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexBasis: '50%'
  },
  [theme.breakpoints.down('md')]: {
    margin: '12px 0 0 0'
  },
  avatar: {
    backgroundColor: '#e0e0e0'
  },
  menu: {
    boxShadow: '0 1px 1px 0 rgba(216,224,234,0.5)',
  },
  menuItem: {
    color: '#c6c6c6',
    '&:hover': {
      color: '#f4f4f4',
      backgroundColor: '#353535'
    }
  },
  paper: {
    backgroundColor: '#161616'
  },
  // toolbar: {
  //   flexDirection: 'column'
  // }
}))

function RightNav (props) {
  const classes = useStyles()

  const [anchorEl, setAnchorEl] = React.useState(null)
  const { options, render } = props

  const openMenu = (evt) => setAnchorEl(evt.currentTarget)

  const closeMenu = () => setAnchorEl(null)

  return (
    <div
      className={classes.root}
      // className={classes.toolbar}
    >
      {render()}
      <Avatar
        onClick={openMenu}
        className={classes.avatar}
      />
      <Menu
        anchorEl={anchorEl}
        onClose={closeMenu}
        open={Boolean(anchorEl)}
        keepMounted
        className={classes.menu}
        PaperProps={{ square: true, className: classes.paper }}
      >
        {options.map(option => (
          <MenuItem
            key={option.label}
            onClick={option.onClick}
            className={classes.menuItem}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

export default RightNav
