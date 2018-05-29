import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import unescapeHtml from 'lodash.unescape'
import { exportHtml } from 'monograph'

class ContentPreviewDialog extends React.Component {
  state = {
    html: ''
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.open !== this.props.open
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (!nextProps.open) return null
    if (prevState.html) return null
    return { html: unescapeHtml(exportHtml(nextProps.editorState)) }
  }

  render () {
    const { open, onClose } = this.props
    const { html } = this.state
    return (
      <div>
        <Dialog
          open={open}
          onClose={onClose}
          aria-labelledby='content-preview-dialog-title'
          aria-describedby='content-preview-dialog-description'
        >
          <DialogTitle id='content-preview-dialog-title'>Preview</DialogTitle>
          <DialogContent>
            <pre className='language-html'><code>{`${html}`}</code></pre>
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

export default ContentPreviewDialog
