import React from 'react'
import PropTypes from 'prop-types'
import ToolbarButton from '../PostEditorToolbarButton'
import classes from './styles.scss'

const PostEditorToolbar = props => (
  <React.Fragment>
    <div className={classes.toolbar}>
      <ToolbarButton onClick={evt => props.onClick('history')}>
        History
      </ToolbarButton>
      <ToolbarButton onClick={evt => props.onClick('postmeta')}>
        Postmeta
      </ToolbarButton>
    </div>
  </React.Fragment>
)

PostEditorToolbar.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default PostEditorToolbar

