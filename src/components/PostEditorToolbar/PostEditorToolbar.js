import React from 'react'
import PropTypes from 'prop-types'
import Button from 'antd/lib/button'
import classes from './styles.scss'

const PostEditorToolbar = props => (
  <div className={classes.toolbar}>
    <Button onClick={evt => props.onClick('history')}>
      History
    </Button>
    <Button onClick={evt => props.onClick('postmeta')}>
      Postmeta
    </Button>
  </div>
)

PostEditorToolbar.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default PostEditorToolbar

