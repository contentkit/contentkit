import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Inspector from 'react-inspector'
import { withStyles } from '@material-ui/core/styles'

class PostEditorInspectorDialog extends React.Component {
  state = { raw: {} }
  static getDerivedStateFromProps (nextProps, prevState) {
    if (!nextProps.open) return null
    if (prevState.raw.blocks) return null
    return { raw: nextProps.convertToRaw(nextProps.editorState.getCurrentContent()) }
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.open !== this.props.open
  }

  render () {
    const { open, onClose, classes } = this.props
    const { raw } = this.state
    return (
      <div>
        <Dialog
          open={open}
          onClose={onClose}
          aria-labelledby='content-preview-dialog-title'
          aria-describedby='content-preview-dialog-description'
        >
          <DialogTitle
            id='content-preview-dialog-title'
            disableTypography
          >
            <h2>Preview</h2>
          </DialogTitle>
          <DialogContent
            className={classes.root}
          >
            <Inspector
              theme={'chromeLight'}
              data={raw}
              expandLevel={1}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color='primary' autoFocus>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default withStyles({
  root: {
    minHeight: '40vh',
    width: '60vw'
  }
})(PostEditorInspectorDialog)
