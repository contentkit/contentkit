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
    keyBindingFn,
    blockRendererFn,
    createHandleKeyCommand,
    save
  } = props
  const handleKeyCommand = createHandleKeyCommand(save)
  return (
    <Editor
      editorState={editorState}
      onChange={onChange}
      plugins={plugins.plugins}
      keyBindingFn={keyBindingFn}
      blockRendererFn={blockRendererFn}
      handleKeyCommand={handleKeyCommand}
    />
  )
}

const { hasCommandModifier } = KeyBindingUtil

function keyBindingFn (evt) {
  if (evt.keyCode === 83 && hasCommandModifier(evt)) {
    return 'editor-save'
  }

  if (evt.key === 'Backspace') {
    return 'backspace'
  }

  if (evt.key === 'Tab') {
    return 'tab'
  }

  return getDefaultKeyBinding(evt)
}

function createHandleKeyCommand (callback) {
  return (command) => {
    if (command === Command.EDITOR_SAVE) {
      callback()
      return HANDLED
    }
    return NOT_HANDLED
  }
}

const blockRendererFn = (block) => {
  if (block.getType() === Block.TABLE) {
    return {
      component: () => null,
      props: {}
    }
  }
}

ContentKitEditor.defaultProps = {
  keyBindingFn,
  createHandleKeyCommand,
  blockRendererFn
}

export default ContentKitEditor
