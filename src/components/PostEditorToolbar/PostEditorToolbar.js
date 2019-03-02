import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import ToolbarButton from '../PostEditorToolbarButton'

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  iconSmall: {
    fontSize: 20
  },
  toolbar: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-end'
  }
})

const PostEditorToolbar = props => (
  <React.Fragment>
    <div className={props.classes.toolbar}>
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
  onClick: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(PostEditorToolbar)
