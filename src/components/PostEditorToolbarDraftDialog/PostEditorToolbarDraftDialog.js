// @flow
import React from 'react'
import PropTypes from 'prop-types'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { EditorState } from 'draft-js'
import Button from '@material-ui/core/Button'
import { Monograph } from 'monograph'
import { fromKey, toKey } from '../../containers/PostEditor/util'
import { removeVersions } from './removeVersions'

class DraftEditorDialog extends React.Component {
  static propTypes = {
    open: PropTypes.bool,
    version: PropTypes.shape({
      key: PropTypes.string,
      timestamp: PropTypes.number
    }),
    adapter: PropTypes.object,
    setEditorState: PropTypes.func,
    editorState: PropTypes.object,
    post: PropTypes.object,
    client: PropTypes.object,
    handleClose: PropTypes.func
  }

  componentDidUpdate () {
    let key = this.props.version && this.props.version.key
    if (
      this.props.open &&
      this.version !== key
    ) {
      this.version = key
      this.props.setEditorState(this.loadEditor())
    }
  }

  loadEditor = () => {
    const { editorState, version } = this.props
    const contentState = this.props.adapter.restore(version.key)
    return EditorState.push(editorState, contentState)
  }

  handleRestore = () => {
    this.props.onChange(this.props.editorState)
    this.props.handleClose(null)
    this.handleCleanUp()
  }

  handleCleanUp = () => {
    const { Post } = this.props.post
    const documentKey = Post.document.id
    let [versionId, diffNumber] = fromKey(this.props.version.key)
    let key = toKey(documentKey, 'versions')
    let allDeltas = JSON.parse(
      window.localStorage.getItem(key)
    ).slice(0, diffNumber)
    let deltas = allDeltas.slice(0, diffNumber)
    let toDelete = allDeltas.slice(diffNumber)
    toDelete.forEach(({ key }) => {
      window.localStorage.removeItem(key)
    })
    window.localStorage.setItem(key, JSON.stringify(deltas))
    removeVersions(this.props.post, this.props.client, versionId)
  }

  render () {
    // let decorators = this.props.decorators
    // if (decorators) {
    //  decorators = decorators.toArray()
    // }
    return (
      <Dialog
        open={this.props.open}
        maxWidth={'md'}
      >
        <DialogTitle disableTypography>Preview</DialogTitle>
        <DialogContent>
          <Monograph
            readOnly
            editorState={this.props.editorState}
            onChange={() => {}}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleRestore} color='primary' variant='raised'>
            Restore
          </Button>
          <Button onClick={this.props.handleClose} color='primary' autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default DraftEditorDialog
