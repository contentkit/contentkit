import { connect } from 'react-redux'
import PostEditor from './PostEditor'
import * as selectors from '../../store/selectors'
import * as actions from '../../store/actions'

const mapStateToProps = state => ({
  editorState: state.app.editorState,
  status: state.app.status,
  localRawEditorState: selectors.getRawEditorState(state)
})

const mapDispatchToProps = {
  setEditorState: actions.setEditorState,
  saveEditorState: actions.saveEditorState,
  discardLocalEditorState: actions.discardLocalEditorState,
  setStatus: actions.setStatus
}


export default connect(mapStateToProps, mapDispatchToProps)(PostEditor)
