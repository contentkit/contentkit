// @flow
import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import { withStyles } from '@material-ui/core/styles'
import Fade from '@material-ui/core/Fade'
import Avatar from '@material-ui/core/Avatar'

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  menu: {
    boxShadow: '0 1px 1px 0 rgba(216,224,234,0.5)'
  },
  menuItem: {
    color: '#8c8c8c',
    '&:hover': {
      color: '#2f54eb',
      backgroundColor: '#fff'
    }
  },
  '@media (max-width: 767px)': {
    root: {
      margin: '12px 0 0 0'
    }
  },
  iconButton: {
  },
  avatar: {
    backgroundImage: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)'
  }
}

function RightNav (props) {
  const { options, render, classes, anchorEl } = props
  return (
    <div
      className={classes.root}
    >
      {render()}
      <IconButton
        aria-label='More'
        aria-owns={anchorEl ? 'right-nav' : null}
        aria-haspopup='true'
        onClick={props.setAnchorEl}
        className={classes.iconButton}
      >
        <Avatar alt="" className={classes.avatar} />
      </IconButton>
      <Menu
        id='right-nav'
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => props.setAnchorEl({ currentTarget: null })}
        disableAutoFocus
        classes={{
          paper: classes.menu
        }}
        TransitionComponent={Fade}
      >
        {options.map(option =>
          <MenuItem
            onClick={option.onClick}
            key={option.label}
            classes={{
              root: classes.menuItem
            }}
          >
            {option.label}
          </MenuItem>
        )}
      </Menu>
    </div>
  )
}

RightNav.defaultProps = {
  toolbar: <div />,
  render: () => <div />
}

export default withStyles(styles)(RightNav)
