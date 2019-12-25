import React from 'react'
import { Sidebar } from '@contentkit/sidebar'
import { EditorToolbar, LayoutContainer, LayoutContent } from '@contentkit/components'
import { makeStyles } from '@material-ui/styles'
import { Editor } from '@contentkit/editor'
import { EditorState } from 'draft-js'

const useStyles = makeStyles(theme => ({
  container: {
    width: 'calc(100% - 60px)',
    marginLeft: 60,
    backgroundColor: '#f4f4f4',
    minHeight: '100vh'
  },
  content: {
    padding: 40,
    boxSizing: 'border-box',
    minHeight: 'calc(100vh - 48px)'
  }
}))

function Playground (props) {
  const [editorState, setEditorState] = React.useState(EditorState.createEmpty())
  const classes = useStyles()
  return (
    <div>
      <Sidebar
        client={props.client}
        history={props.history}
        logged={true}
      />
      <LayoutContainer>
        <EditorToolbar 
          setEditorState={setEditorState}
          getEditorState={() => editorState}
        />
        <LayoutContent>
          <Editor
            onChange={setEditorState}
            editorState={editorState}
            renderToolbar={() => null}
            classes={{}}
            spellCheck={false}
          />
        </LayoutContent>
      </LayoutContainer>
    </div>
  )
}

export default Playground

