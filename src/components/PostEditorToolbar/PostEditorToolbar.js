import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { unstable_deferredUpdates as deferredUpdates } from 'react-dom'
import DraftEditorDialog from '../PostEditorToolbarDraftDialog'
import SnapshotsMenu from '../PostEditorToolbarSnapshotsMenu'
import ToolbarButton from '../PostEditorToolbarButton'
import { EditorState } from 'draft-js'

const createEmpty = () => EditorState.createEmpty()

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

class PostEditorToolbar extends React.Component {
  static propTypes = {
    onClick: PropTypes.func,
    classes: PropTypes.object,
    post: PropTypes.object,
    adapter: PropTypes.object,
    cacheKey: PropTypes.number,
    client: PropTypes.object,
    onChange: PropTypes.func
  }

  state = {
    editorState: createEmpty(),
    draftEditorDialogOpen: false,
    version: undefined,
    snapshotMenuAnchorEl: undefined,
    tooltip: {}
  }

  handleDraftEditorDialogClose = (evt) => {
    let _evt = evt
    this.setState(({ draftEditorDialogOpen }) => {
      if (!draftEditorDialogOpen) return null
      let partialState = { draftEditorDialogOpen: false }
      if (_evt === null) {
        partialState.snapshotMenuAnchorEl = undefined
      }
      return partialState
    })
  }

  setEditorState = (editorState) => deferredUpdates(() =>
    this.setState({ editorState }))

  update = (data) => this.setState(data)

  deferredUpdate = (data) => deferredUpdates(() => this.setState(data))

  render () {
    const {
      onClick,
      classes
    } = this.props
    return (
      <React.Fragment>
        <DraftEditorDialog
          setEditorState={this.setEditorState}
          handleClose={this.handleDraftEditorDialogClose}
          editorState={this.state.editorState}
          update={this.update}
          open={this.state.draftEditorDialogOpen}
          version={this.state.version}
          post={this.props.post}
          adapter={this.props.adapter}
          onChange={this.props.onChange}
          decorators={this.props.decorators}
          client={this.props.client}
          deferredUpdate={this.deferredUpdate}
        />
        <div
          className={classes.toolbar}>
          <SnapshotsMenu
            post={this.props.post}
            update={this.update}
            adapter={this.props.adapter}
            cacheKey={this.props.cacheKey}
            deferredUpdate={this.deferredUpdate}
            tooltip={this.state.tooltip}
            editorState={this.state.editorState}
            anchorEl={this.state.snapshotMenuAnchorEl}
          />
          <ToolbarButton onClick={evt => onClick('preview')}>
            Preview
          </ToolbarButton>
          <ToolbarButton onClick={evt => onClick('postmeta')}>
            Postmeta
          </ToolbarButton>
          <ToolbarButton onClick={evt => onClick('inspector')}>
            Inspect
          </ToolbarButton>
        </div>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(PostEditorToolbar)
