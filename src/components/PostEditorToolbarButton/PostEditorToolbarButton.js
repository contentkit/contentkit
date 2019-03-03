// @flow
import React from 'react'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'

const PostEditorToolbarButton = withStyles(
  theme => ({
    button: {
      margin: theme.spacing.unit,
      '&:hover': {}
    }
  })
)(({ classes, ...rest }) => (
  <Button
    className={classes.button}
    color='primary'
    variant='outlined'
    {...rest}
  >
    {rest.children}
  </Button>
))

export default PostEditorToolbarButton
