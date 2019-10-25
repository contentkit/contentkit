import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import Button from '../Button'

const useStyles = makeStyles(theme => ({
  toolbar: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  button: {
    marginRight: 15
  }
}))

function PostEditorToolbar (props) {
  const classes = useStyles(props)
  return (
    <div className={classes.toolbar}>
      <Button onClick={evt => props.onClick('history')} className={classes.button}>
        History
      </Button>
      <Button onClick={evt => props.onClick('postmeta')} className={classes.button}>
        Postmeta
      </Button>
    </div>
  )
}

PostEditorToolbar.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default PostEditorToolbar
