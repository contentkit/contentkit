import { connect } from 'react-redux'
import flowRight from 'lodash.flowright'
import { withRouter } from 'react-router-dom'
import PostEditor from './PostEditor'
import * as selectors from '../../store/selectors'
import * as actions from '../../store/actions'

const mapStateToProps = (state) => ({
  status: state.app.status,
  localRawEditorState: selectors.getRawEditorState(state)
})

const mapDispatchToProps = {
  saveEditorState: actions.saveEditorState,
  saveEditorStateLocally: actions.saveEditorStateLocally,
  discardLocalEditorState: actions.discardLocalEditorState,
  setStatus: actions.setStatus
}


export default flowRight([
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
])(PostEditor)
