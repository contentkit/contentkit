import React from 'react'
import PropTypes from 'prop-types'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import { withStyles } from '@material-ui/core/styles'
import { Editor, EditorState, convertFromRaw } from 'draft-js'
import { expand } from 'draft-js-compact'
import format from 'date-fns/format'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'

const formatDate = (timestamp) =>
  format(new Date(timestamp), 'MM/DD HH:mm:ss')

const styles = theme => ({
  row: {
    display: 'flex'
  },
  column: {
    display: 'flex',
    flexDirection: 'column'
  }
})

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
    let contentState = convertFromRaw(expand(raw))
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
    // this.props.saveDocument({
    //  editorState: this.state.editorState
    // })
    this.props.setEditorState(
      EditorState.push(
        this.props.editorState,
        this.state.editorState.getCurrentContent(),
        'insert-fragment'
      )
    )
  }

  render () {
    const { post, classes } = this.props
    const versions = post?.data?.post?.document?.versions || []
    console.log(this.props)
    return (
      <Dialog open={this.props.open} onClose={this.props.onClose}>
        <DialogTitle disableTypography>History</DialogTitle>
        <DialogContent>
          <div className={classes.row}>
            <div className={classes.column}>
              <List>
                {versions.map(version => (
                  <ListItem onClick={evt => this.handleClick(version)} button key={version.id}>
                    {formatDate(version.createdAt)}
                  </ListItem>
                ))}
              </List>
            </div>
            <div>
              <Editor
                editorState={this.state.editorState}
                readOnly
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant='text'
            onClick={this.props.onClose}
            color={'secondary'}
          >Close</Button>
          <Button
            variant='text'
            onClick={this.handleRestore}
            color={'primary'}
          >
            Restore
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default withStyles(styles)(PostEditorHistoryModal)
