// @flow
import React from 'react'
import ContentPreviewDialog from './ContentPreviewDialog'
import InspectorDialog from './InspectorDialog'
import PostMetaModal from './PostMetaModal'

interface props {
  editorState: any,
  open: bool,
  html: string,
  auth: any,
  setDialogState: (any) => void
}

const Modals = (props: props) => {
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
      />
      <InspectorDialog
        open={open === 'inspector'}
        onClose={() => setDialogState(undefined)}
        editorState={editorState}
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

Modals.defaultProps = {
  open: 'none',
  html: ''
}

export default Modals
