import React from 'react'
import PropTypes from 'prop-types'
import DraftTableCell from '../DraftTableCell'
import debounce from 'lodash.debounce'
import chunk from 'lodash.chunk'

const log = debounce(console.log.bind(console), 500)

const GUTTER_SIZE = 10

class DraftTableRow extends React.Component {
  static propTypes = {
    row: PropTypes.arrayOf(PropTypes.object).isRequired,
    onFocus: PropTypes.func.isRequired
  }

  render () {
    const { classes, row } = this.props
    return (
      <div
        className={classes.tableRow}
        onMouseDown={this.props.onMouseDown}
        style={{ display: 'flex', width: '100%' }}
        ref={this.ref}
      >
        {row.map((left, index) => {
          return (
            <React.Fragment>
              <DraftTableCell
                cell={left}
                key={left.key}
                width={
                  this.props.styles[index] || (100 / this.props.row.length)
                }
                {...this.props}
              >
                {index < row.length - 1 && (<div
                  className={classes.draggingLine}
                  onMouseDown={evt => this.props.onDragStart(evt, this.props.row, index)}
                />)}
              </DraftTableCell>
            </React.Fragment>
          )
        })}
      </div>
    )
  }
}

export default DraftTableRow
