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

const Toolbar = plugins.customToolbarPlugin.CustomToolbar

const awsConfig = {
  identityPoolId: config.IDENTITY_POOL_ID,
  region: config.AWS_REGION,
  bucketName: config.AWS_BUCKET_NAME,
  endpoint: config.AWS_BUCKET_URL + '/'
}

const styles = theme => ({
  footer: {
    position: 'fixed',
    width: '100%',
    bottom: 0,
    left: 0,
    right: 0,
    // height: 45,
    zIndex: 500,
    // backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    boxShadow: 'rgba(8, 35, 51, 0.03) 0px 0px 2px, rgba(8, 35, 51, 0.05) 0px 3px 6px'
  },
  toolbar: {
    width: '100%',
    height: 40,
    padding: '0 74px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  root: {
    width: '100%'
  },
  colorPrimary: {
    //backgroundColor: '#10239e'
  },
  barColorPrimary: {
    //backgroundColor: '#030852'
  }
})

const PostEditorComponent = props => {
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
  } = props
  const toolbarProps = {
    config: awsConfig,
    id: post.data.post.id,
    images: post.data.post.images,
    deleteImage,
    createImage,
    insertImage
  }
  const variant = loading ? 'indeterminate' : 'determinate'
  return (
    <React.Fragment>
      <Editor
        editorState={editorState}
        onChange={onChange}
        save={save}
        plugins={plugins.plugins}
      />
      <div className={classes.footer}>
        <Toolbar {...toolbarProps} />
      </div>
    </React.Fragment>
  )
}

export default withStyles(styles)(PostEditorComponent)
