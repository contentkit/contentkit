// @flow

import React from 'react'
import PropTypes from 'prop-types'
import Layout from '../Layout'
import { exportHtml } from 'monograph/lib/util'
import insertImage from 'monograph/lib/modifiers/insertImage'
import PostEditorToolbar from '../../components/PostEditorToolbar'
import escapeHtml from 'lodash.escape'
import PostEditorComponent from '../../components/PostEditorComponent'
import PostEditorModals from '../../components/PostEditorModals'
import {
  hydrate,
  toRaw,
  convertToHtml
} from './util'
import { connect } from 'react-redux'
import { setEditorState } from '../../lib/redux'
import { EditorState } from 'draft-js'
import type { User, SetEditorState } from '../../types'

type Props = {
  history: any,
  editorState: EditorState,
  setEditorState: SetEditorState,
  hydrated: boolean,
  logged: boolean,
  updateDocument: ({
    mutate: (document: any) => void
  }) => void,
  updatePost: () => void,
  client: any
}

type State = {
  open: boolean,
  html: string,
  loading: boolean
}

class BaseEditor extends React.Component<Props, State> {
  _hasUnmounted: boolean
  decorators: any

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
  _hasUnmounted = false

  componentDidMount () {
    if (this.props.hydrated) return
    const editorState = hydrate(this.props)
    this.props.setEditorState(editorState)
  }

  componentWillUnmount () {
    this._hasUnmounted = true
  }

  // shouldComponentUpdate (nextProps, nextState) {
  //  return nextProps.editorState !== this.props.editorState ||
  //    nextState.open !== this.state.open ||
  //    nextProps.logged !== this.props.logged ||
  //    nextState.loading !== this.state.loading
  // }

  saveDocument = ({ editorState }) => {
    const {
      post: {
        data: {
          post: {
            document
          }
        }
      }
    } = this.props
    const raw = toRaw(editorState)
    const html = convertToHtml(editorState)
    return this.props.updateDocument.mutate({
      id: document.id,
      raw: raw,
      html: html
    })
  }

  manualSave = async () => {
    // this.sync.cancel()
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

  componentDidUpdate (prevProps, prevState) {
    const { post, hydrated } = this.props
    if (!post.data.post) return
    if (!hydrated) return
    // this.sync()
  }

  getHtml = (editorState = this.props.editorState) =>
    escapeHtml(exportHtml(editorState))

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
      >
        <PostEditorModals
          editorState={this.props.editorState}
          setEditorState={this.props.setEditorState}
          client={this.props.client}
          post={this.props.post}
          setDialogState={this.handleToolbarClick}
          open={this.state.open}
          getHtml={this.getHtml}
          user={this.props.user}
          saveDocument={this.saveDocument}
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

export default connect(
  state => state,
  dispatch => ({
    setEditorState: (editorState: EditorState) => dispatch(
      setEditorState(editorState)
    )
  })
)(BaseEditor)
