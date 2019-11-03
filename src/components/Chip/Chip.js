import React from 'react'
import { Chip } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import clsx from 'clsx'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    borderRadius: 4,
    color: '#fff'
  }
}))

function StyledChip (props) {
  const classes = useStyles(props)
  const { className: classNameProp, ...rest } = props
  const className = clsx(classes.root, classNameProp)
  return (
    <Chip {...rest} className={className} />
  )
}

export default StyledChip

