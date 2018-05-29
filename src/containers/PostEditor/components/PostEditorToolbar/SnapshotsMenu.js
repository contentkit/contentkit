import React from 'react'
import PropTypes from 'prop-types'
import format from 'date-fns/format'
import { withStyles } from '@material-ui/core/styles'
import Menu, { MenuItem } from '@material-ui/core/Menu'
import Tooltip from '@material-ui/core/Tooltip'
import { unstable_deferredUpdates as deferredUpdates } from 'react-dom'
import ToolbarButton from './PostEditorToolbarButton'
import memoize from 'lodash.memoize'
import { fromKey } from '../../util'
import * as jsondiffpatch from 'jsondiffpatch'
import { decompress } from '../../compress'
import './jsondiffpatch.css'
import { EditorState } from 'draft-js'

const formatDate = memoize((timestamp) =>
  format(new Date(timestamp * 1000), 'MM/DD HH:mm:ss')
)

class MenuItemContent extends React.Component {
  // shouldComponentUpdate (nextProps, nextState) {
  //  return nextProps?.version?.key !== this.props?.version?.key /* eslint-disable-line */
  // }

  render () {
    const {
      version,
      handleMenuClose,
      handleMenuItemClick,
      handleMenuItemMouseEnter,
      handleMenuItemMouseLeave
    } = this.props
    return (
      <div style={{display: 'inline-flex', justifyContent: 'center', width: '100%'}}>
        <MenuItem
          onMouseEnter={() => handleMenuItemMouseEnter(version.key)}
          onMouseLeave={() => handleMenuItemMouseLeave(version.key)}
          onClose={handleMenuClose}
          onClick={handleMenuItemClick}
          key={`menu_item_${version.key}`}
          style={{
            padding: '16px 32px'
          }}
        >
          {formatDate(version.timestamp)}
        </MenuItem>
      </div>
    )
  }
}

class SnapshotsMenu extends React.Component {
  state = {
    anchorEl: null,
    versions: [],
    cacheKey: 0
  }

  static propTypes = {
    post: PropTypes.object,
    adapter: PropTypes.object,
    cacheKey: PropTypes.number,
    update: PropTypes.func
  }

  handleMenuClose = () => {
    this.setState({ anchorEl: null })
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
    console.time('loadEditor')
    const { editorState } = this.props
    const contentState = this.props.adapter.restore(key)
    console.timeEnd('loadEditor')

    return EditorState.push(editorState, contentState)
  }

  onMouseEnter = () => {
    let versions = this.props.adapter.getVersions()
    if (!versions?.length) return /* eslint-disable-line */
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

  getTooltipHtml = memoize((key) => {
    let [versionId] = fromKey(key)
    let versions = this.props?.post?.Post?.document?.versions /* eslint-disable-line */
    if (!versions) return ''
    let snapshot = versions.find(({ id }) => id === versionId)
    if (!snapshot) return ''
    let snapshotText = decompress(snapshot?.raw).blocks.map(b => b.text || '') /* eslint-disable-line */
    const contentState = this.props.adapter.restore(key)
    let text = contentState.getBlockMap().toArray().map(b => b.text || '')
    let delta = jsondiffpatch.diff(snapshotText, text)
    let html = jsondiffpatch.formatters.html.format(delta, snapshotText)
    return html
  })

  handleMenuItemMouseEnter = (key) => {
    let html = this.getTooltipHtml(key)
    let editorState = this.loadEditor(key)
    this.props.update({
      tooltip: { html, key },
      editorState
    })
  }

  handleMenuItemMouseLeave = (key) => {
    this.props.deferredUpdate(prevState => {
      if (prevState.tooltip?.key !== key) {
        return null
      }
      return { tooltip: {} }
    })
  }

  render () {
    const { anchorEl } = this.props
    const versions = this.state?.versions || [] /* eslint-disable-line */
    return (
      <React.Fragment>
        <Tooltip
          title={<div dangerouslySetInnerHTML={{ __html: this.props.tooltip?.html }} />}  /* eslint-disable-line */
          classes={{
            tooltip: this.props.classes.tooltip
          }}
          open={Boolean(anchorEl && this.props.tooltip?.html)} /* eslint-disable-line */
          placement={'left'}
          disableFocusListener
          disableHoverListener
          disableTouchListener
        >
          <ToolbarButton
            aria-owns={anchorEl ? 'simple-menu' : null}
            aria-haspopup='true'
            onClick={this.handleButtonClick}
            onMouseEnter={this.onMouseEnter}
          >
            History
          </ToolbarButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleMenuClose}
          classes={{
            paper: this.props.classes.paper
          }}
        >
          <div>
            <div>
              {versions.map((version, index) => (
                <MenuItemContent
                  version={version}
                  handleMenuClose={this.handleMenuClose}
                  handleMenuItemClick={this.handleMenuItemClick(version)}
                  handleMenuItemMouseEnter={this.handleMenuItemMouseEnter}
                  handleMenuItemMouseLeave={this.handleMenuItemMouseLeave}
                  key={version.key}
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

export default withStyles(
  theme => ({
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
    open: {}
  })
)(SnapshotsMenu)
