import React from 'react'
import PropTypes from 'prop-types'
import { Editor, EditorState, convertFromRaw } from 'draft-js'
import { expand } from 'draft-js-compact'
import distanceInWords from 'date-fns/distance_in_words'

import Button from 'antd/lib/button'
import Modal from 'antd/lib/modal'
import classes from './styles.scss'
import clsx from 'clsx'
import Timeline from 'antd/lib/Timeline'

const formatDate = (timestamp) =>
  distanceInWords(new Date(timestamp), new Date())

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
    let contentState = convertFromRaw(
      expand(raw)
    )

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
    const versions = post?.data?.post?.versions || []
    return (
      <Modal
        width={700}
        visible={this.props.open}
        onCancel={this.props.onClose}
        onOK={() => {}}
        title={'History'}
        footer={[
          <Button
            variant='text'
            onClick={this.props.onClose}
            color={'secondary'}
          >
            Close
          </Button>,
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
          <div className={clsx(classes.column, classes.sidebar)}>
            <Timeline>
              {
                versions.map(version => {
                  return (
                    <Timeline.Item onClick={evt => this.handleClick(version)} key={version.id}>
                      <div>
                        {formatDate(version.createdAt)}
                      </div>
                      <div>
                        {version?.raw?.blocks[0]?.text || ''}
                      </div>
                    </Timeline.Item>
                  )
                })
              }
            </Timeline>
          </div>
          <div className={classes.column}>
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
