// @flow

import React from 'react'
import PropTypes from 'prop-types'
import Layout from '../Layout'
import { exportHtml } from 'monograph/lib/util'
import insertImage from 'monograph/lib/modifiers/insertImage'
import PostEditorToolbar from '../../components/PostEditorToolbar'
import escapeHtml from 'lodash.escape'
import MonographEditor from '../../components/MonographEditor'
import Modals from '../../components/PostEditorModals'
import {
  hydrate,
  toKey,
  restoreContentState,
  getRawDiff,
  toRaw,
  convertToHtml,
  shouldIncrement,
  setDiff
} from './util'
import LocalStorage from './LocalStorage'
import debounce from 'lodash.debounce'
import { connect } from 'react-redux'
import { setEditorState } from '../../lib/redux'
import { createVersion } from './mutations'
import memoize from 'lodash.memoize'
import { postShape } from '../../shapes'
import { EditorState } from 'draft-js'
import { wrapWithLoadingState } from '../../lib/util'
import type { Post, User, SetEditorState } from '../../types'

const _getVersions = memoize((cacheKey, id) => {
  const key = toKey(id, 'versions')
  const versions = new LocalStorage().get(key)
  return versions
})

type Props = {
  history: any,
  post: {
    Post: Post
  },
  auth: {
    user: User
  },
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
  cacheKey: number
  _hasUnmounted: boolean
  decorators: any

  static propTypes = {
    history: PropTypes.object.isRequired,
    post: PropTypes.shape({
      data: PropTypes.shape({
        post: postShape
      })
    }),
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
  cacheKey = 1
  _hasUnmounted = false

  adapter = {
    getVersions: () => {
      const { post: { data: { post: { document } } } } = this.props
      return _getVersions(this.cacheKey, document.id)
    },
    restore: (diffKey) => {
      const { post: { data: { post: { document } } } } = this.props
      return restoreContentState(document, diffKey)
    }
  }

  componentDidMount () {
    if (this.props.hydrated) return
    const editorState = hydrate(this.props)
    this.props.setEditorState(editorState)
  }

  componentWillUnmount () {
    this.sync.cancel()
    this._hasUnmounted = true
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.editorState !== this.props.editorState ||
      nextState.open !== this.state.open ||
      nextProps.logged !== this.props.logged ||
      nextState.loading !== this.state.loading ||
      nextProps.post !== this.props.post
  }

  sync = debounce(() => {
    const { diff, raw } = getRawDiff(
      this.props.editorState,
      (this.props.post.data.post.document)
    )
    if (!diff) return
    wrapWithLoadingState(
      (...args) => this.setState(...args),
      () => this.syncContent({ raw, diff }),
      () => this._isUnmounted
    )
  }, 3000)

  saveDocument = ({ raw }) => {
    const { editorState } = this.props
    const { data: { post } } = this.props.post
    const { document } = post
    const html = convertToHtml(editorState)
    this.props.updateDocument.mutate({
      id: document.id,
      raw: raw,
      html: html
    })
    this.cacheKey++
  }

  manualSave = () => {
    // this.sync.cancel()
    const raw = toRaw(this.props.editorState)
    // wrapWithLoadingState(
    //  (...args) => this.setState(...args),
    //  () => this.saveDocument({ raw }),
    //  () => this._hasUnmounted
    // )
    this.saveDocument({ raw })
  }

  syncContent = async ({ diff, raw }) => {
    const { client, post } = this.props
    const { document: postDocument } = post.data.post
    let document = postDocument
    if (!postDocument) return
    if (!diff) return
    if (
      !postDocument.versions.length ||
      shouldIncrement(postDocument)
    ) {
      let { data } = await createVersion({ client, post, raw })
      document = data.post.document
    }
    setDiff({ diff, document })
    this.saveDocument({ raw })
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
      post={this.props.post}
      getHtml={this.getHtml}
      adapter={this.adapter}
      onChange={this.onChange}
      decorators={this.decorators}
      client={this.props.client}
      cacheKey={this.cacheKey}
      editorState={this.props.editorState}
    />
  )

  renderEditor = () => (
    <React.Fragment>
      <Modals
        editorState={this.props.editorState}
        client={this.props.client}
        updatePost={this.props.updatePost}
        post={this.props.post}
        setDialogState={this.handleToolbarClick}
        open={this.state.open}
        getHtml={this.getHtml}
        auth={this.props.auth}
      />
      <MonographEditor
        {...this.props}
        onChange={this.onChange}
        editorState={this.props.editorState}
        save={this.manualSave}
        insertImage={this.insertImage}
        loading={this.state.loading}
      />
    </React.Fragment>
  )

  render = () => {
    return (
      <Layout
        history={this.props.history}
        render={this.renderToolbar}
        client={this.props.client}
        logged={this.props.logged}
      >
        {this.renderEditor()}
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
