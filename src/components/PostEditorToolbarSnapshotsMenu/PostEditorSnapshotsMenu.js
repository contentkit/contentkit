// @flow
import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Menu from '@material-ui/core/Menu'
import { unstable_deferredUpdates as deferredUpdates } from 'react-dom'
import ToolbarButton from '../PostEditorToolbarButton'
import memoize from 'lodash.memoize'
import { fromKey } from '../../containers/PostEditor/util'
import * as compact from 'draft-js-compact'
import SnapshotsMenuItemContent from './SnapshotsMenuItemContent'
import { EditorState, ContentState } from 'draft-js'
import type { LocalStorageVersion, Post, Adapter } from '../../types'
import Tooltip from '../Tooltip'

type snapshotMenuAnchorEl = ?HTMLElement
type anchorEl = ?HTMLElement

const styles = theme => ({
  paper: {
    width: 300,
    maxHeight: 500
  },
  tooltip: {
    backgroundColor: '#fff',
    color: '#4c6072',
    width: 300,
    height: 200,
    marginTop: 10,
    overflow: 'hidden',
    '&$open': {
      opacity: 1
    }
  },
  open: {},
  content: {
    display: 'inline-flex',
    justifyContent: 'center',
    width: '100%'
  },
  menuItem: {
    padding: '16px 32px'
  },
  menuList: {
    '&:focus': {
      outline: 'none'
    }
  }
})

class SnapshotsMenu extends React.Component<{
  post: Post,
  adapter: Adapter,
  cacheKey: number,
  update: (data: any) => ContentState,
  editorState: EditorState,
  classes: any
}, {
  anchorEl: anchorEl,
  versions: Array<LocalStorageVersion>,
  cacheKey: number
}> {
  state = {
    anchorEl: null,
    versions: [],
    cacheKey: 0
  }

  static propTypes = {
    post: PropTypes.object,
    adapter: PropTypes.object,
    cacheKey: PropTypes.number,
    update: PropTypes.func,
    editorState: PropTypes.object,
    classes: PropTypes.object
  }

  handleMenuClose = () => {
    this.props.update({
      snapshotMenuAnchorEl: null
    })
  }

  handleButtonClick = ({ currentTarget }) => {
    this.props.update({
      snapshotMenuAnchorEl: currentTarget
    })
  }

  handleMenuItemClick = version => evt => {
    this.props.update({
      draftEditorDialogOpen: true,
      version,
      tooltip: {}
    })
  }

  loadEditor = (key) => {
    const { editorState } = this.props
    const contentState = this.props.adapter.restore(key)
    return EditorState.push(editorState, contentState, 'insert-fragment')
  }

  onMouseEnter = () => {
    let versions = this.props.adapter.getVersions()
    if (!(versions && versions.length)) return
    deferredUpdates(() => {
      let { cacheKey } = this.props
      this.setState(prevState => {
        if (prevState.cacheKey === cacheKey) {
          console.log(`Not updating - cacheKey is still ${cacheKey}`)
          return null
        }
        return { versions, cacheKey }
      })
    })
  }

  getTooltipHtml = memoize(async (key) => {
    let [versionId] = fromKey(key)
    let post = this.props.post
    let versions = post && post.data.post.document && post.data.post.document.versions
    if (!versions) return ''
    let snapshot = versions.find(({ id }) => id === versionId)
    if (!snapshot) return ''
    let snapshotText = compact.expand(snapshot && snapshot.raw).blocks
      .map(b => b.text || '') /* eslint-disable-line */
    const contentState = this.props.adapter.restore(key)
    let text = contentState.getBlockMap().toArray().map(b => b.text || '')
    let { diff, format } = await import('jsondiffpatch')
      .then(module => ({
        diff: module.diff,
        format: module.formatters.html.format
      }))
    // const diff = jsondiffpatch.diff
    // const format = jsondiffpatch.formatters.html.format
    let delta = diff(snapshotText, text)
    let html = format(delta, snapshotText)
    return html
  })

  handleMenuItemMouseEnter = async (key) => {
    let html = await this.getTooltipHtml(key)
    let editorState = this.loadEditor(key)
    this.props.update({
      tooltip: { html, key },
      editorState
    })
  }

  handleMenuItemMouseLeave = (key) => {
    this.props.deferredUpdate(prevState => {
      if ((prevState.tooltip && prevState.tooltip.key) !== key) {
        return null
      }
      return { tooltip: {} }
    })
  }

  render () {
    const { anchorEl, tooltip, classes } = this.props
    const versions = this.state.versions || []
    const html = tooltip && tooltip.html
    return (
      <React.Fragment>
        <Tooltip
          open={Boolean(anchorEl && html)}
          dangerouslySetInnerHTML={{ __html: html }}
          placement={'left'}
        />
        <ToolbarButton
          aria-owns={anchorEl ? 'simple-menu' : null}
          aria-haspopup='true'
          onClick={this.handleButtonClick}
          onMouseEnter={this.onMouseEnter}
        >
            History
        </ToolbarButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleMenuClose}
          classes={{
            paper: classes.paper
          }}
          onMouseLeave={this.handleMenuItemMouseLeave}
          disableAutoFocus
          transitionDuration={0}
          MenuListProps={{ className: classes.menuList }}
        >
          <div>
            <div>
              {versions.map((version, index) => (
                <SnapshotsMenuItemContent
                  version={version}
                  handleMenuClose={this.handleMenuClose}
                  handleMenuItemClick={this.handleMenuItemClick(version)}
                  handleMenuItemMouseEnter={this.handleMenuItemMouseEnter}
                  handleMenuItemMouseLeave={this.handleMenuItemMouseLeave}
                  key={version.key}
                  className={classes.content}
                />
              )
              )}
            </div>
          </div>
        </Menu>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(SnapshotsMenu)
