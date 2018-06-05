import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import { withStyles } from '@material-ui/core/styles'

const withStylesProps = styles =>
  Component =>
    props => {
      const Comp = withStyles(styles(props))(Component)
      return <Comp {...props} />
    }

const styles = props => theme => {
  let color = (props.variant && props.variant === 'raised')
    ? theme.palette[props.color].main
    : '#ffffff'
  let contrastColor = theme.palette.getContrastText(color)
  return {
    spinner: {
      color: contrastColor,
      marginLeft: '10px'
    }
  }
}

export default withStylesProps(styles)(
  props => (
    <CircularProgress
      className={props.classes.spinner}
      size={20}
    />
  )
)
