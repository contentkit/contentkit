import React from 'react'
import { ButtonBase } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { fade } from '@material-ui/core/styles/colorManipulator'

import clsx from 'clsx'

const useStyles = makeStyles((theme) => ({
  root: {
    lineHeight: 1.499,
    position: 'relative',
    display: 'inline-block',
    fontWeight: 400,
    whiteSpace: 'nowrap',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all .3s cubic-bezier(.645,.045,.355,1)',
    userSelect: 'none',
    touchAction: 'manipulation',
    height: 40,
    padding: '0 15px',
    fontSize: 14,
    borderRadius: 0,
    color: '#fff',
    textShadow: '0 -1px 0 rgba(0,0,0,.12)',
    boxShadow: '0 2px 0 rgba(0,0,0,.045)'
  },
  danger: {
    backgroundColor: theme.variables.colors.danger,
    '&:hover': {
      backgroundColor: fade(theme.variables.colors.danger, 0.8)
    }
  },
  success: {
    backgroundColor: theme.variables.colors.success,
    '&:hover': {
      backgroundColor: fade(theme.variables.colors.success, 0.8)
    }
  },
  fancy: {
    // backgroundImage: 'linear-gradient(160deg, #121212 12.5%, #323232 85%)',
    // '&:hover': {
    //   backgroundImage: 'linear-gradient(160deg, #262626 12.5%, #595959 85%)',
    // }
  },
  default: {
    backgroundColor: '#0f62fe',
    color: '#fff',
    '&:hover': {}
  },
  secondary: {
    backgroundColor: 'transparent',
    color: theme.palette.text.primary
  }
}))

function WrappedButton (props) {
  const { color, className: classNameProp, ...rest } = props
  const classes = useStyles(props)
  // @ts-ignore
  const className = clsx(classes.root, classes[color], classNameProp)
  return (
    <ButtonBase {...rest} className={className} />
  )
}

WrappedButton.defaultProps = {
  variant: 'contained',
  color: 'default'
}

export default WrappedButton
