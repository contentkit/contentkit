
import React from 'react'
import { EditorToolbar, ContentBlockButtons, InlineStyleButtons } from '@contentkit/toolbar'

function HeadlinePicker (props) {
  return (
    <div
      onMouseDown={evt => evt.preventDefault()}
      className={props.classes.buttonWrapper}>
      <button
        className={props.classes.button}
        type='button'
        children='H'
      />
    </div>
  )
}

export const structure = [
  [ContentBlockButtons.Image],
  [ContentBlockButtons.Video],
  [
    ContentBlockButtons.Picker,
    ContentBlockButtons.H1,
    ContentBlockButtons.H2,
    ContentBlockButtons.H3,
  ],
  [ContentBlockButtons.OrderedList],
  [ContentBlockButtons.OrderedList],
  [ContentBlockButtons.BlockQuote],
  [ContentBlockButtons.Language],
  [InlineStyleButtons.Link],
  [InlineStyleButtons.Bold],
  [InlineStyleButtons.Italic],
  [InlineStyleButtons.Underline],
  [InlineStyleButtons.Code],
  [ContentBlockButtons.Table]
]

export const classes = {
  toolbarStyles: {
    toolbar: 'contentkit-toolbar-2',
    modal: 'contentkit-toolbar-modal-wrapper'
  },
  button: 'contentkit-button',
  buttonWrapper: 'contentkit-button-wrapper',
  active: 'contentkit-button-active',
  toolbar: 'contentkit-toolbar-2',
  input: 'contentkit-toolbar-input',
  inputInvalid: 'contentkit-toolbar-input-invalid',
  link: 'contentkit-toolbar-link'
}

function Toolbar (props) {
  return (
    <EditorToolbar structure={structure} classes={classes} {...props} />
  )
}

export default Toolbar
