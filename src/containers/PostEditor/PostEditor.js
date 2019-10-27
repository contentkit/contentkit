// @flow

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose, withApollo } from 'react-apollo'

import Layout from '../Layout'
import { exportHtml } from '@contentkit/editor/lib/util'
import insertImage from '@contentkit/editor/lib/modifiers/insertImage'
import PostEditorToolbar from '../../components/PostEditorToolbar'
import PostEditorComponent from '../../components/PostEditorComponent'
import PostEditorModals from '../../components/PostEditorModals'
import {
  hydrate,
  toRaw,
  convertToHtml
} from './util'
import { setEditorState } from '../../lib/redux'
import withData from './withData'
import styles from './styles.scss'
import { encode } from '../../lib/utf8'

class BaseEditor extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    editorState: PropTypes.object,
    setEditorState: PropTypes.func,
    hydrated: PropTypes.bool,
    logged: PropTypes.bool,
    updateDocument: PropTypes.object,
    updatePost: PropTypes.func
  }

  state = {
    open: false,
    html: '',
    loading: false
  }

  componentDidMount () {
    const editorState = hydrate(this.props.editorState, this.props.posts?.data?.posts[0]?.raw)
    this.props.setEditorState(editorState)
  }

  saveDocument = ({ editorState }) => {
    const {
      posts: {
        data: {
          posts
        }
      }
    } = this.props
    const raw = toRaw(editorState)
    const html = convertToHtml(editorState)
    return this.props.updateDocument.mutate({
      id: posts[0].id,
      raw: raw,
      encodedHtml: html
    })
  }

  manualSave = async () => {
    await new Promise((resolve, reject) => this.setState({
      loading: true
    }, resolve))
    await this.saveDocument({
      editorState: this.props.editorState
    })
    await new Promise((resolve, reject) => this.setState({
      loading: false
    }, resolve))
  }

  getHtml = (editorState = this.props.editorState) =>
    encode(exportHtml(editorState))

  onChange = editorState => {
    this.props.setEditorState(editorState)
  }

  handleToolbarClick = open => {
    if (open !== this.state.open) {
      this.setState({ open })
    }
  }

  insertImage = (src) => {
    this.props.setEditorState(
      insertImage(
        this.props.editorState,
        src
      )
    )
  }

  renderToolbar = () => (
    <PostEditorToolbar
      onClick={this.handleToolbarClick}
    />
  )

  render = () => {
    return (
      <Layout
        history={this.props.history}
        render={this.renderToolbar}
        client={this.props.client}
        logged={this.props.logged}
        className={styles.layout}
      >
        <PostEditorModals
          editorState={this.props.editorState}
          setEditorState={this.props.setEditorState}
          client={this.props.client}
          posts={this.props.posts}
          setDialogState={this.handleToolbarClick}
          open={this.state.open}
          getHtml={this.getHtml}
          users={this.props.users}
          saveDocument={this.saveDocument}
          createImage={this.props.createImage}
          deleteImage={this.props.deleteImage}
        />
        <PostEditorComponent
          {...this.props}
          onChange={this.onChange}
          editorState={this.props.editorState}
          save={this.manualSave}
          insertImage={this.insertImage}
          loading={this.state.loading}
        />
      </Layout>
    )
  }
}

export default compose(
  withApollo,
  connect(
    state => state.app,
    { setEditorState }
  ),
  withData
)(BaseEditor)
