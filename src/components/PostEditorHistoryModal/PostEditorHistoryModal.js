import React from 'react'
import PropTypes from 'prop-types'
import { Editor, EditorState, convertFromRaw } from 'draft-js'
import { expand } from 'draft-js-compact'
import format from 'date-fns/format'
import Button from 'antd/lib/button'
import List from 'antd/lib/list'
import Modal from 'antd/lib/modal'
import classes from './styles.scss'

const formatDate = (timestamp) =>
  format(new Date(timestamp), 'MM/DD HH:mm:ss')

class PostEditorHistoryModal extends React.Component {
  state = {
    editorState: EditorState.createEmpty()
  }

  static propTypes = {
    open: PropTypes.bool.isRequired,
    post: PropTypes.object.isRequired
  }

  handleClick = version => {
    let { raw } = version
    let contentState = convertFromRaw(expand(raw, { parent: null, children: List(), prevSibling: null, nextSibling: null }))
    this.setState({
      editorState: EditorState.push(
        this.state.editorState,
        contentState,
        'insert-fragment'
      )
    })
  }

  handleRestore = () => {
    this.props.onClose()
    this.props.setEditorState(
      EditorState.push(
        this.props.editorState,
        this.state.editorState.getCurrentContent(),
        'insert-fragment'
      )
    )
  }

  render () {
    const { post } = this.props
    const versions = post?.data?.post?.document?.versions || []
    return (
      <Modal
        visible={this.props.open}
        onCancel={this.props.onClose}
        onOK={() => {}}
        title={'History'}
        footer={[
          <Button
            variant='text'
            onClick={this.props.onClose}
            color={'secondary'}
          >Close</Button>,
          <Button
            variant='text'
            onClick={this.handleRestore}
            color={'primary'}
          >
            Restore
          </Button>
        ]}
      >
        <div className={classes.row}>
          <div className={classes.column}>
            <List
              dataSource={versions}
              renderItem={(version) => (
                <List.Item onClick={evt => this.handleClick(version)} key={version.id}>
                  {formatDate(version.createdAt)}
                </List.Item>
              )}
            />
          </div>
          <div>
            <Editor
              editorState={this.state.editorState}
              readOnly
            />
          </div>
        </div>
      </Modal>
    )
  }
}

export default PostEditorHistoryModal
