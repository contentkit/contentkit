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

const PostEditorModals = (props: Props) => {
  const {
    editorState,
    open,
    html,
    setDialogState,
    user,
    ...rest
  } = props
  console.log(props)

  if (!open) return false
  return (
    <React.Fragment>
      <PostEditorHistoryModal
        open={open === 'history'}
        onClose={() => setDialogState(undefined)}
        post={props.post}
        saveDocument={props.saveDocument}
        editorState={props.editorState}
        setEditorState={props.setEditorState}
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
        client={rest.client}
        updatePost={rest.updatePost}
        post={rest.post}
      />
    </React.Fragment>
  )
}

PostEditorModals.defaultProps = {
  open: 'none',
  html: ''
}

export default PostEditorModals
