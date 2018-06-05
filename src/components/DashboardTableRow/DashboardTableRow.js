// @flow
import React from 'react'
import PropTypes from 'prop-types'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Checkbox from '@material-ui/core/Checkbox'
import EmptyTableRow from '../DashboardTableEmptyRow'
import type { Post } from '../../types'

type Props = {
  post: Post,
  handleClick: () => void,
  handlePostSelect: (Post) => void,
  selected: boolean,
  loading: boolean,
  id: string
}

class DashboardTableRow extends React.Component<Props, {}> {
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
    const title = (post && post.postMeta.title) || ''
    const status = (post && post.postMeta.status) || ''
    const projectName = (post && post.project.name) || ''
    const needsRefresh = !(post.postMeta || post.document)
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

const Row = props => props.loading ? <EmptyTableRow {...props} /> : <DashboardTableRow {...props} />

export default Row
