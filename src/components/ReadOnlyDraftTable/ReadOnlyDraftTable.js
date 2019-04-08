import React from 'react'
import groupBy from 'lodash.groupby'

class ReadOnlyDraftTable extends React.Component {
  handleMouseDown = evt => {
    this.props.blockProps.handleClick(this.props.block.getKey())
  }

  render () {
    const data = this.props.block.getData().get('table')
    const table = groupBy(data, v => v.row)
    const isEmpty = data.every(v => !v.text)

    return (
      <div
        className={'draft-table'}
        data-offset-key={this.props.offsetKey}
        onClick={this.handleMouseDown}
        contentEditable={false}
        readOnly
      >{isEmpty
          ? <div className={'draft-table-placeholder'}>Click to add data</div>
          : Object.values(table).map((row, i) => (
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
          ))
        }
      </div>
    )
  }
}

export default ReadOnlyDraftTable


