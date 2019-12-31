import React from 'react'
import PropTypes from 'prop-types'
import { Editor, EditorState, convertFromRaw } from 'draft-js'
import { expand } from 'draft-js-compact'
import distanceInWords from 'date-fns/distance_in_words'

import clsx from 'clsx'

import { Dialog, DialogTitle, DialogActions, DialogContent } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

import Button from '../Button'

const useStyles = makeStyles(theme => ({
  row: {
    display: 'flex'
  },
  sidebar: {
    marginRight: 30,
    flexBasis: '30%',
  },
  column: {
    display: 'flex',
    flexDirection: 'column'
  }
}))

const formatDate = (timestamp) =>
  distanceInWords(new Date(timestamp), new Date())

function PostEditorHistoryModal (props) {
  const { 
    onClose,
    open,
    posts
  } = props
  const classes = useStyles(props)
  const [editorState, setEditorState] = React.useState(EditorState.createEmpty())

  const handleClick = version => {
    const { raw } = version
    const contentState = convertFromRaw(expand(raw))

    setEditorState(
      EditorState.push(editorState, contentState, 'insert-fragment')
    )
  }

  const handleRestore = () => {
    onClose()
    props.setEditorState(
      EditorState.push(props.editorState, editorState.getCurrentContent(), 'insert-fragment')
    )
  }

  const versions = []

  return (
    <Dialog
      fullWidth
      onClose={onClose}
      open={open}
      PaperProps={{
        square: true
      }}
    >
      <DialogTitle>History</DialogTitle>
      <DialogContent>
        <div className={classes.row}>
          <div className={clsx(classes.column, classes.sidebar)}>
            {/* <Timeline>
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
            </Timeline> */}
          </div>
          <div className={classes.column}>
            <Editor
              editorState={editorState}
              readOnly
            />
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          variant='text'
          onClick={onClose}
          color={'secondary'}
        >
          Close
        </Button>
        <Button
          variant='text'
          onClick={handleRestore}
          color={'primary'}
        >
          Restore
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PostEditorHistoryModal
