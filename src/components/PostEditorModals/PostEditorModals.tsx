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
      users,
      createImage,
      deleteImage,
      ...rest
    } = this.props

    return (
      <React.Fragment>
        <PostEditorHistoryModal
          open={open === 'history'}
          onClose={() => setDialogState(undefined)}
          posts={this.props.posts}
          saveDocument={this.props.saveDocument}
          editorState={this.props.editorState}
          setEditorState={this.props.setEditorState}
        />
        <PostMetaModal
          open={open === 'postmeta'}
          users={users}
          onClose={() => setDialogState(undefined)}
          client={this.props.client}
          posts={this.props.posts}
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
