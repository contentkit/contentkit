import React from 'react'
import PropTypes from 'prop-types'
import DraftTableCell from '../DraftTableCell'
import debounce from 'lodash.debounce'

class DraftTableRow extends React.Component {
  static PropTypes = {
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
                width={(100 / this.props.row.length)}
                {...this.props}
              >
                {index < row.length - 1 && (<div
                  className={classes.draggingLine}
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
