import React from 'react'
import groupBy from 'lodash.groupby'

class ReadOnlyDraftTable extends React.Component {
  handleMouseDown = evt => {
    this.props.blockProps.handleClick(this.props.block.getKey())
  }

  getRows = () => {
    const rows = this.props.block.getData().get('table')
    return groupBy(rows, 'row')
  }

  render () {
    const rows = this.getRows()
    return (
      <div
        className={'draft-table'}
        data-offset-key={this.props.offsetKey}
        onClick={this.handleMouseDown}
        contentEditable={false}
        readOnly
      >
        {Object.values(rows).map((row, i) => (
          <div className={'draft-row'} key={i}>
            {row.map(cell => (
              <div
                className={'draft-cell'}
                data-key={cell.key}
                data-colspan={cell.colSpan}
                data-rowspan={cell.rowSpan}
                key={cell.key}
              >
                {cell.value}
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  }
}

export default ReadOnlyDraftTable


