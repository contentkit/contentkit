import React from 'react'
import { Menu, MenuItem, Avatar } from '@material-ui/core'
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
    backgroundImage: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
  },
  menu: {
    boxShadow: '0 1px 1px 0 rgba(216,224,234,0.5)',
  },
  menuItem: {
    color: '#8c8c8c',
    '&:hover': {
      color: '#2f54eb',
      backgroundColor: '#fff'
    }
  }
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
    >
      {render()}
      <Avatar
        onClick={openMenu}
        className={classes.avatar}
        src={`https://avatar.tobi.sh/1234`}
      />
      <Menu
        anchorEl={anchorEl}
        onClose={closeMenu}
        open={Boolean(anchorEl)}
        keepMounted
        className={classes.menu}
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
