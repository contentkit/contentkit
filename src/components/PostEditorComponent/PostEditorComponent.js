// @flow
import React from 'react'
import * as config from '../../lib/config'
import { Editor } from 'monograph'
import plugins from 'monograph/lib/plugins'
import LinearProgress from '@material-ui/core/LinearProgress'
import { withStyles } from '@material-ui/core/styles'

import 'monograph/lib/css/normalize.css'
import 'monograph/lib/css/Draft.css'
import 'monograph/lib/css/prism.css'
import 'monograph/lib/css/CheckableListItem.css'
import 's3-dropzone/lib/styles.css'
import 'draft-js-code-block-plugin/lib/style.css'

const { CustomToolbar } = plugins.customToolbarPlugin

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
    boxSizing: 'border-box'
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
    const variant = loading ? 'indeterminate' : 'determinate'
    console.log(this.props)
    return (
      <React.Fragment>
        <div className={classes.flex}>
          <div className={classes.editorContainer}>
            <Editor
              editorState={editorState}
              onChange={onChange}
              save={save}
              plugins={plugins.plugins}
            />
          </div>
          <div className={classes.toolbar}>
            <CustomToolbar {...toolbarProps} />
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(PostEditorComponent)
