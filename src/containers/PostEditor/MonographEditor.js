// @flow
import React from 'react'
import * as config from '../../lib/config'
import * as monograph from 'monograph'
import LinearProgress from '@material-ui/core/LinearProgress'
import { withStyles } from '@material-ui/core/styles'

const { Monograph, plugins } = monograph
const { customToolbarPlugin: { CustomToolbar } } = plugins

const awsConfig = {
  identityPoolId: config.IDENTITY_POOL_ID,
  region: config.AWS_REGION,
  bucketName: config.AWS_BUCKET_NAME,
  endpoint: config.AWS_BUCKET_URL + '/'
}

const MonographEditor = props => {
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
    id: post.Post.id,
    images: post.Post.images,
    deleteImage,
    createImage,
    insertImage
  }
  const variant = loading ? 'indeterminate' : 'determinate'
  return (
    <React.Fragment>
      <Monograph
        editorState={editorState}
        onChange={onChange}
        save={save}
        plugins={plugins.plugins}
      />
      <div className={classes.footer}>
        <LinearProgress value={100} variant={variant} classes={{
          root: classes.root,
          colorPrimary: classes.colorPrimary,
          barColorPrimary: classes.barColorPrimary
        }} />
        <div className={classes.toolbar}>
          <CustomToolbar {...toolbarProps} />
        </div>
      </div>
    </React.Fragment>
  )
}

export default withStyles(theme => ({
  footer: {
    position: 'fixed',
    width: '100%',
    bottom: 0,
    left: 0,
    right: 0,
    height: 45,
    zIndex: 500,
    backgroundColor: '#4c6072',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flexStart',
    alignItems: 'center'
  },
  toolbar: {
    width: '100%',
    height: 40,
    padding: '0 74px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  root: {
    width: '100%'
  },
  colorPrimary: {
    backgroundColor: '#9bacbf'
    //backgroundColor: '#4c6072'
  },
  barColorPrimary: {
    backgroundColor: '#4c6072'
    //backgroundColor: '#9bacbf'
  }
}))(MonographEditor)
