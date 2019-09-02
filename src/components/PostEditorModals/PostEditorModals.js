// @flow
import React from 'react'
import PostMetaModal from '../PostEditorMetaModal'
import PostEditorHistoryModal from '../PostEditorHistoryModal'

class PostEditorModals extends React.Component {
  render () {
    const {
      editorState,
      open,
      html,
      setDialogState,
      user,
      createImage,
      deleteImage,
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
        <PostMetaModal
          open={open === 'postmeta'}
          user={user}
          onClose={() => setDialogState(undefined)}
          client={this.props.client}
          post={this.props.post}
          createImage={createImage}
          deleteImage={deleteImage}
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
