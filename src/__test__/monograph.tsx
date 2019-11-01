import React from 'react'
import './enzyme'
import { createEmpty } from '@contentkit/editor'
import Monograph from '@contentkit/editor/lib/editor'
import { mount } from 'enzyme'
import * as config from '../lib/config'
import ReactTestUtils from 'react-dom/test-utils'
import sinon from 'sinon'
import { EditorState, ContentState } from 'draft-js'
import { selectBlock } from 'draft-js-blocks'

const BUTTONS = [
  'InsertImageButton', // 0
  'HeadlinesPickerButton', // 1
  'UnorderedListButton', // 2
  'OrderedListButton', // 3
  'BlockquoteButton', // 4
  'CodeBlockLangButton', // 5
  'TableButton', // 6
  'LinkButton', // 7
  'BoldButton', // 8
  'ItalicButton',
  'UnderlineButton',
  'CodeButton'
]

class MockEditor extends React.Component {
  state = {
    editorState: EditorState.createWithContent(
      ContentState.createFromText('lorem')
    )
  }

  select () {
    const { editorState } = this.state
    const block = editorState.getCurrentContent().getFirstBlock()
    const selection = editorState.getSelection()
      .merge({ focusOffset: block.getText().length, anchorOffset: 0 })
    this.onChange(
      EditorState.forceSelection(this.state.editorState, selection)
    )
  }

  onChange = editorState => {
    this.setState({ editorState })
  }

  render () {
    return (
      <Monograph
        editorState={this.state.editorState}
        onChange={this.onChange}
        toolbarProps={{
          config: {
            identityPoolId: config.IDENTITY_POOL_ID,
            region: config.AWS_REGION,
            bucketName: config.AWS_BUCKET_NAME,
            endpoint: config.AWS_BUCKET_URL + '/'
          },
          createImage: () => {},
          deleteImage: () => {},
          id: '1234',
          images: []
        }}
      />
    )
  }
}

describe('monograph', () => {
  it('monograph', () => {
    const editor = mount(<MockEditor />)
    const editorSpy = sinon.spy(editor.instance(), 'onChange')

    const draftEditor = editor.find('.DraftEditor-editorContainer').childAt(0)

    const toolbar = editor.find('.customToolbar').childAt(0)
    const boldButton = toolbar.childAt(8).find('InlineStyleButton')
    editor.instance().select()
    boldButton.instance().toggleStyle({ preventDefault: () => {} })
    // const ed = editor.find('.public-DraftEditor-content')
    const editorState = editor.state().editorState
  })
})
