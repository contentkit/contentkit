// @flow
import React from 'react'
import PropTypes from 'prop-types'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Checkbox from '@material-ui/core/Checkbox'
import EmptyTableRow from './EmptyTableRow'

class AdminTableRow extends React.Component {
  static propTypes = {
    post: PropTypes.object,
    handleClick: PropTypes.func,
    selected: PropTypes.bool,
    loading: PropTypes.bool,
    id: PropTypes.string
  }

  static defaultProps = {
    post: {},
    handleClick: () => {},
    selected: false,
    loading: true
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.selected ||
      (this.props.selected && !nextProps.selected) ||
      nextProps.post.id !== this.props.post.id
  }

  handleClick = () => {
    this.props.handlePostSelect(this.props.post)
  }

  render () {
    const {
      id,
      post,
      selected
    } = this.props
    const title = post?.postMeta?.title || post?.title || '' /* eslint-disable-line */
    const status = post?.postMeta?.status || post?.status || '' /* eslint-disable-line */
    const projectName = post?.project?.name || '' /* eslint-disable-line */
    const needsRefresh = !post?.postMeta || !post?.document /* eslint-disable-line */
    return (
      <TableRow
        onClick={this.handleClick}
        role='checkbox'
        tabIndex='-1'
        selected={selected}
        aria-checked={selected}
        key={`row-${id}`}
        id={id}
      >
        <TableCell
          style={{ padding: 0, width: '7%' }}
        >
          <Checkbox
            checked={selected}
          />
        </TableCell>
        <TableCell
          style={{ padding: 0 }}
        >
          {title}
        </TableCell>
        <TableCell>{status}</TableCell>
        <TableCell>{projectName}</TableCell>
        <TableCell>{needsRefresh ? 'Needs Refresh' : 'OK'}</TableCell>
      </TableRow>
    )
  }
}

export default props => props.loading ? <EmptyTableRow {...props} /> : <AdminTableRow {...props} />
