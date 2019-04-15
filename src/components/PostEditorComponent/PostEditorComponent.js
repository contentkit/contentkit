// @flow
import React from 'react'
import * as config from '../../lib/config'
import { Editor } from '@contentkit/editor'
import { setEditorStateBlockMap, Block, Command, HANDLED, NOT_HANDLED } from '@contentkit/util'
import plugins from '@contentkit/editor/lib/plugins'
import LinearProgress from '@material-ui/core/LinearProgress'
import { withStyles } from '@material-ui/core/styles'
import { CSSTransition } from 'react-transition-group'
import { genKey, ContentBlock } from 'draft-js'
import keyBindingFn from './keyBindingFn'
import DraftTableDialog from '../DraftTableDialog'
import ReadOnlyDraftTable from '../ReadOnlyDraftTable'

import '@contentkit/editor/lib/css/normalize.css'
import '@contentkit/editor/lib/css/Draft.css'
import '@contentkit/editor/lib/css/prism.css'
import '@contentkit/editor/lib/css/CheckableListItem.css'
import 's3-dropzone/lib/styles.css'
import '@contentkit/code/src/style.scss'

const Toolbar = plugins.toolbar

const awsConfig = {
  identityPoolId: config.IDENTITY_POOL_ID,
  region: config.AWS_REGION,
  bucketName: config.AWS_BUCKET_NAME,
  endpoint: config.AWS_BUCKET_URL + '/'
}

const styles = theme => ({
  footer: {
  },
  toolbar: {
    width: 80,
    padding: '20px 15px',
    boxSizing: 'border-box',
    height: 'calc(100vh - 69px)'
  },
  root: {
    width: '100%'
  },
  colorPrimary: {
  },
  barColorPrimary: {
  },
  flex: {
    display: 'flex',
    // todo fix react sibling bug
    flexDirection: 'row-reverse'
  },
  editorContainer: {
    width: '100%',
    borderTopLeftRadius: 30,
    backgroundColor: '#f0f5ff',
    backgroundImage: 'linear-gradient(160deg, #f0f5ff 12.5%, #d6e4ff 85%)',
    padding: 40,
    boxSizing: 'border-box',
    position: 'relative'
  },
  loadingIndicator: {
    position: 'absolute',
    zIndex: 9999999,
    width: '100%'
  }
})

class PostEditorComponent extends React.Component {
  state = {
    open: false,
    tableBlockKey: undefined
  }

  handleClick = evt => {
    let { clientY } = evt
    const { editorState } = this.props
    const currentContent = editorState.getCurrentContent()
    const blockMap = currentContent.getBlockMap()

    const last = blockMap.toSeq().last()
    if (!last) return

    const blockKey = last.getKey()
    const elem = document.querySelector(`[data-offset-key="${blockKey}-0-0"]`)
    if (!elem) return
    const rect = elem.getBoundingClientRect()

    if (clientY < rect.bottom) return
    const newBlockKey = genKey()

    const newBlockMap = blockMap
      .set(newBlockKey, new ContentBlock({ key: newBlockKey }))

    this.props.onChange(
      setEditorStateBlockMap(editorState, newBlockMap, newBlockKey)
    )
  }

  handleKeyCommand = (command) => {
    if (command === Command.EDITOR_SAVE) {
      this.props.save()
      return HANDLED
    }
    return NOT_HANDLED
  }

  handleOpen = tableBlockKey => {
    this.setState({ open: true, tableBlockKey })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  blockRendererFn = (block) => {
    if (block.getType() === Block.TABLE) {
      return {
        component: ReadOnlyDraftTable,
        props: {
          handleClick: this.handleOpen
        }
      }
    }
  }

  render () {
    const {
      classes,
      editorState,
      deleteImage,
      createImage,
      post,
      onChange,
      mutate,
      save,
      insertImage,
      loading,
      ...rest /* eslint-disable-line */
    } = this.props

    return (
      <React.Fragment>
        <div className={classes.flex}>
          <div className={classes.editorContainer} onClick={this.handleClick}>
            <CSSTransition
              classNames={'transition'}
              unmountOnExit
              timeout={1000}
              in={loading}
            >
              {state => (
                <LinearProgress className={classes.loadingIndicator} />
              )}
            </CSSTransition>
            <Editor
              editorState={editorState}
              onChange={onChange}
              plugins={plugins.plugins}
              keyBindingFn={keyBindingFn}
              blockRendererFn={this.blockRendererFn}
              handleKeyCommand={this.handleKeyCommand}
            />
          </div>
          <div className={classes.toolbar}>
            <Toolbar.Component
              config={awsConfig}
              refId={post.data.post.id}
              images={post.data.post.images}
              deleteImage={deleteImage}
              createImage={createImage}
              insertImage={insertImage}
            />
          </div>
        </div>
        <DraftTableDialog
          onChange={this.props.onChange}
          editorState={this.props.editorState}
          open={this.state.open}
          tableBlockKey={this.state.tableBlockKey}
          handleOpen={this.handleOpen}
          handleClose={this.handleClose}
        />
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(PostEditorComponent)
