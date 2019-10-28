import React from 'react'
import { makeStyles } from '@material-ui/styles'
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
  checkbox: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0,0,0,0)',
    border: 0,
    visibility: 'visible',
    whiteSpace: 'nowrap'
  },
  root: {},
  label: {
    boxSizing: 'border-box',
    margin: 0,
    border: "0",
    "fontSize":".875rem",
    "fontFamily":"inherit",
    "verticalAlign":"baseline",
    "fontWeight":"400",
    "lineHeight":"1.5rem",
    "letterSpacing":".16px",
    "position":"relative",
    "display":"flex",
    "cursor":"pointer",
    "padding":"0 0 0 1.625rem",
    "minHeight":"1.5rem",
    "WebkitUserSelect":"none",
    "MozUserSelect":"none",
    "MsUserSelect":"none",
    "userSelect":"none",
    '&:before': {
      "backgroundColor": "#161616",
      "borderColor": "#161616",
      "borderWidth": "1px",
      "boxSizing": "border-box",
      "content": "\"\"",
      "width": "1rem",
      "height": "1rem",
      "margin": ".125rem",
      "position": "absolute",
      "left": "0",
      "top": ".125rem",
      "backgroundColor": "transparent",
      "border": "1px solid #161616",
      "borderRadius": "1px"
    },
    '&:after': {
      boxSizing: 'content-box',
      "content": "\"\"",
      "position": "absolute",
      "left": ".375rem",
      "top": ".5rem",
      "width": ".4375rem",
      "height": ".1875rem",
      "background": "none",
      "borderLeft": "2px solid #fff",
      "borderBottom": "2px solid #fff",
      "WebkitTransform": "scale(0) rotate(-45deg)",
      "transform": "scale(0) rotate(-45deg)",
      "transformOrigin": "bottom right",
      "marginTop": "-.1875rem"
    }
  },
  checkedLabel: {
    '&:before': {
      backgroundColor: '#161616'
    },
    '&:after': {
      transform: 'scale(1) rotate(-45deg)'
    }
  }
}))

function Checkbox (props) {
  const classes = useStyles(props)
  const labelClassName = clsx(classes.label, {
    [classes.checkedLabel]: props.checked
  })
  console.log(props)
  return (
    <div className={classes.root}>
      <input
        type='checkbox'
        className={classes.checkbox}
        {...props}
      />
      <label htmlFor={props.id} className={labelClassName}></label>
    </div>
  )
}

export default Checkbox
