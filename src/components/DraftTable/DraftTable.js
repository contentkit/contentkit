import React from 'react'
import DraftTableRow from '../DraftTableRow'

class DraftTable extends React.Component {
  ref = React.createRef()

  onMouseDown = evt => {}

  render () {
    const {
      classes,
      onTableKeyDown,
      tableRows,
      onKeyDown,
      onClickCell,
      onChange,
      editing,
      onFocus,
      selected
    } = this.props
    return (
      <div clsasName={classes.table} onKeyDown={onTableKeyDown}>
        <div className={classes.tableBody} ref={this.ref}>
          {Object.values(tableRows).map((row, rowIndex) => (
            <DraftTableRow
              key={rowIndex}
              row={row}
              editing={editing}
              onChange={onChange}
              onClickCell={onClickCell}
              onKeyDown={onKeyDown}
              onFocus={onFocus}
              classes={classes}
              selected={selected}
            />
          ))}
        </div>
      </div>
    )
  }
}

export default DraftTable
