// @flow

import React from 'react'
import PropTypes from 'prop-types'
import Layout from '../Layout'
import { exportHtml, insertImage } from 'monograph'
import PostEditorToolbar from './components/PostEditorToolbar'
import escapeHtml from 'lodash.escape'
import MonographEditor from './MonographEditor'
import Modals from './components/Modals'
import {
  hydrate,
  LocalStore,
  toKey,
  restoreContentState,
  getRawDiff,
  toRaw,
  convertToHtml,
  shouldIncrement,
  setDiff
} from './util'
import debounce from 'lodash.debounce'
import { unstable_deferredUpdates as deferredUpdates } from 'react-dom'
import { connect } from 'react-redux'
import { setEditorState, preloadDiffs } from '../../redux'
import { createVersion } from './mutations'
import memoize from 'lodash.memoize'

const wrapWithLoadingState = async (update, asyncFn, isUnmounted) => {
  if (isUnmounted()) {
    console.warn('Component is unmounted!')
    return
  }
  let shouldProceed = await new Promise((resolve, reject) => {
    update(prevState => {
      if (prevState.loading || isUnmounted()) {
        console.warn('Could not update loading state to true')
        resolve(false)
        return null
      }
      return { loading: true }
    }, () => resolve(true))
  })
  if (!shouldProceed) return
  await asyncFn()
  deferredUpdates(
    () => update(prevState => {
      if (!prevState.loading || isUnmounted()) {
        console.warn('Could not update loading state to false')
        return null
      }
      return { loading: false }
    })
  )
}

const _getVersions = memoize((cacheKey, id) => {
  const key = toKey(id, 'versions')
  const versions = new LocalStore().get(key)
  return versions
})

class BaseEditor extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    post: PropTypes.shape({
      Post: PropTypes.shape({
        id: PropTypes.string,
        postMeta: PropTypes.shape({
          id: PropTypes.string,
          title: PropTypes.string,
          slug: PropTypes.string,
          status: PropTypes.string
        }),
        document: PropTypes.shape({
          id: PropTypes.string,
          raw: PropTypes.object,
          excerpt: PropTypes.string,
          html: PropTypes.string,
          versions: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string,
            raw: PropTypes.object
          }))
        })
      })
    })
  }

  state = {
    open: null,
    html: '',
    loading: false
  }

  cacheKey = 1
  _hasUnmounted = false

  adapter = {
    getVersions: () => {
      const { post: { Post: { document } } } = this.props
      return _getVersions(this.cacheKey, document.id)
    },
    restore: (diffKey) => {
      const { post: { Post: { document } } } = this.props
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
      this.props?.post?.Post?.document /* eslint-disable-line */
    )
    if (!diff) return
    console.log('syncing...')
    wrapWithLoadingState(
      (...args) => this.setState(...args),
      () => this.syncContent({ raw, diff }),
      () => this._isUnmounted
    )
  }, 8000)

  saveDocument = ({ raw }) => {
    const { editorState } = this.props
    const { Post } = this.props.post
    const { document } = Post
    const excerpt = document.excerpt || raw.blocks[0].text || ''
    const html = convertToHtml(editorState)
    this.props.updateDocument.mutate({
      id: document.id,
      raw: raw,
      excerpt: excerpt,
      html: html
    })
    this.cacheKey++
  }

  manualSave = () => {
    this.sync.cancel()
    const raw = toRaw(this.props.editorState)
    wrapWithLoadingState(
      (...args) => this.setState(...args),
      () => this.saveDocument({ raw }),
      () => this._hasUnmounted
    )
  }

  syncContent = async ({ diff, raw }) => {
    const { client, post } = this.props
    const { Post } = post
    const { document: postDocument } = Post
    let document = postDocument
    if (!postDocument) return
    if (!diff) return
    if (
      !postDocument.versions.length ||
      shouldIncrement(postDocument)
    ) {
      let { data } = await createVersion({ client, post, raw })
      document = data.document
    }
    setDiff({ diff, document })
    this.saveDocument({ raw })
  }

  componentDidUpdate (prevProps, prevState) {
    const { post, hydrated } = this.props
    if (!post.Post) return
    if (!hydrated) return
    const decorator = this.props.editorState.getDecorator()
    if (!decorator) return
    this.decorators = decorator.decorators
    this.sync()
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
      preloadDiffs={this.props.preloadDiffs}
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
    setEditorState: editorState => dispatch(setEditorState(editorState)),
    preloadDiffs: diffs => dispatch(preloadDiffs(diffs))
  })
)(BaseEditor)
