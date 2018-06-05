
import React from 'react'
import PropTypes from 'prop-types'
import MenuItem from '@material-ui/core/MenuItem'
import type { LocalStorageVersion, Post, Adapter } from '../../types'
import memoize from 'lodash.memoize'
import format from 'date-fns/format'

const formatDate = memoize((timestamp) =>
  format(new Date(timestamp * 1000), 'MM/DD HH:mm:ss')
)

type Props = {
  version: LocalStorageVersion,
  handleMenuClose: () => void,
  handleMenuItemClick: () => void,
  handleMenuItemMouseEnter: (key: string) => void,
  handleMenuItemMouseLeave: (key: string) => void
}

class SnapshotsMenuItemContent extends React.Component<Props, {}> {
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

export default SnapshotsMenuItemContent
