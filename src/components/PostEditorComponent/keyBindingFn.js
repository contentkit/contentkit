import {
  getDefaultKeyBinding,
  KeyBindingUtil
} from 'draft-js'

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

export default keyBindingFn
