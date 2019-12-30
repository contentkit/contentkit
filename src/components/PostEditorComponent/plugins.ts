import * as Plugins from '@contentkit/plugins'
import keyBindingFn from './keyBindingFn'

const focusPlugin = new Plugins.Focus({
  classes: {
    focused: 'focused',
    unfocused: 'unfocused'
  }
})

export const plugins = [
  focusPlugin,
  new Plugins.Code({
    classes: {
      container: 'code-block-container',
      content: 'code-block-content',
      header: 'code-block-header',
      tooltip: 'code-block-tooltip',
      error: 'code-block-error',
      warning: 'code-block-warning',
      hover: 'code-block-tooltip-hover'
    }
  }),
  new Plugins.Embed(),
  new Plugins.Image({
    decorator: focusPlugin.decorator,
    classes: {
      image: 'image'
    }
  }),
  new Plugins.Video({
    classes: {
      video: 'video',
      input: 'input',
      inputInvalid: 'input-invalid',
      link: 'link'
    }
  }),
  new Plugins.Anchor({
    classes: {
      input: 'contentkit-toolbar-input',
      link: 'contentkit-toolbar-link',
      inputInvalid: 'contentkit-toolbar-input-invalid',
      button: 'contentkit-button',
      buttonWrapper: 'contentkit-button-wrapper'
    }
  }),
  new Plugins.Prism(),
  new Plugins.Markdown()
]

export default plugins
