import React from 'react'
import { Editor } from '@contentkit/editor'
import {
  getDefaultKeyBinding,
  KeyBindingUtil
} from 'draft-js'
import { Block, Command, HANDLED, NOT_HANDLED } from '@contentkit/util'

function ContentKitEditor (props) {
  const {
    editorState,
    onChange,
    plugins,
    renderToolbar,
    keyBindings,
    save,
    editorRef,
    classes
  } = props
  return (
    <Editor
      editorState={editorState}
      onChange={onChange}
      plugins={plugins}
      classes={classes}
      ref={editorRef}
      keyBindings={{
        [Command.EDITOR_SAVE]: (_, editorState) => {
          save()
          return HANDLED
        }
      }}
    />
  )
}

const blockRendererFn = (block) => {
  if (block.getType() === Block.TABLE) {
    return {
      component: () => null,
      props: {}
    }
  }
}

ContentKitEditor.defaultProps = {}

export default ContentKitEditor
