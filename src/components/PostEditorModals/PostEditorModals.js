// @flow
import React from 'react'
import ContentPreviewDialog from '../PostEditorContentPreviewDialog'
import InspectorDialog from '../PostEditorInspectorDialog'
import PostMetaModal from '../PostEditorMetaModal'
import { convertToRaw, exportHtml } from 'monograph/lib/util'
import PostEditorHistoryModal from '../PostEditorHistoryModal'

type Props = {
  editorState: any,
  open: bool,
  html: string,
  user: any,
  setDialogState: (any) => void
}

class PostEditorModals extends React.Component {
  render () {
    const {
      editorState,
      open,
      html,
      setDialogState,
      user,
      ...rest
    } = this.props

    return (
      <React.Fragment>
        <PostEditorHistoryModal
          open={open === 'history'}
          onClose={() => setDialogState(undefined)}
          post={this.props.post}
          saveDocument={this.props.saveDocument}
          editorState={this.props.editorState}
          setEditorState={this.props.setEditorState}
        />
        <ContentPreviewDialog
          open={open === 'preview'}
          onClose={() => setDialogState(undefined)}
          editorState={editorState}
          exportHtml={exportHtml}
        />
        <InspectorDialog
          open={open === 'inspector'}
          onClose={() => setDialogState(undefined)}
          editorState={editorState}
          convertToRaw={convertToRaw}
        />
        <PostMetaModal
          open={open === 'postmeta'}
          user={user}
          onClose={() => setDialogState(undefined)}
          client={this.props.client}
          post={this.props.post}
        />
      </React.Fragment>
    )
  }
}

PostEditorModals.defaultProps = {
  open: 'none',
  html: ''
}

export default PostEditorModals
