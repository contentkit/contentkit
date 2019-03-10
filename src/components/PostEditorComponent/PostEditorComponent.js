// @flow
import React from 'react'
import * as config from '../../lib/config'
import { Editor } from '@contentkit/editor'
import plugins from '@contentkit/editor/lib/plugins'
import LinearProgress from '@material-ui/core/LinearProgress'
import { withStyles } from '@material-ui/core/styles'
import { CSSTransition } from 'react-transition-group'

import '@contentkit/editor/lib/css/normalize.css'
import '@contentkit/editor/lib/css/Draft.css'
import '@contentkit/editor/lib/css/prism.css'
import '@contentkit/editor/lib/css/CheckableListItem.css'
import 's3-dropzone/lib/styles.css'
import 'draft-js-code-block-plugin/lib/style.css'

const Toolbar= plugins.toolbar

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
    const toolbarProps = {
      config: awsConfig,
      refId: post.data.post.id,
      images: post.data.post.images,
      deleteImage,
      createImage,
      insertImage
    }
    return (
      <React.Fragment>
        <div className={classes.flex}>
          <div className={classes.editorContainer}>
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
              save={save}
              plugins={plugins.plugins}
            />
          </div>
          <div className={classes.toolbar}>
            <Toolbar.Component {...toolbarProps} />
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(PostEditorComponent)
