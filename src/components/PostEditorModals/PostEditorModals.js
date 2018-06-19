// @flow
import React from 'react'
import { withAsync } from 'with-async-component'
import ContentPreviewDialog from '../PostEditorContentPreviewDialog'
import InspectorDialog from '../PostEditorInspectorDialog'
import PostMetaModal from '../PostEditorMetaModal'
import { convertToRaw, exportHtml } from 'monograph/lib/util'

type Props = {
  editorState: any,
  open: bool,
  html: string,
  auth: any,
  setDialogState: (any) => void
}

// const InspectorDialog = withAsync()(
//  () => import('../PostEditorInspectorDialog')
// )
// const ContentPreviewDialog = withAsync()(() => import('../PostEditorContentPreviewDialog'))

// const ContentPreviewDialog = asyncComponent(() => import('../PostEditorContentPreviewDialog'))
// const PostMetaModal = asyncComponent(() => import('../PostEditorMetaModal'))

const PostEditorModals = (props: Props) => {
  const {
    editorState,
    open,
    html,
    setDialogState,
    auth,
    ...rest
  } = props
  if (!open) return false
  return (
    <React.Fragment>
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
        auth={auth}
        open={open === 'postmeta'}
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
