import React from 'react'
import DraftTableRow from '../DraftTableRow'

class DraftTable extends React.Component {
  ref = React.createRef()

  state = {
    styles: {},
    dragging: false,
    left: undefined,
    right: undefined
  }

  cache = {}
  ref = React.createRef()

  componentDidMount () {
    let rect = this.ref.current.getBoundingClientRect()
    this.size = rect.width
    window.addEventListener('mousemove', this.onMouseMove)
    window.addEventListener('mouseup', this.onDragEnd)
  }

  componentDidUpdate (prevProps) {
    // if (prevProps.row.length !== this.props.row.length) {
    //   let rect = this.ref.current.getBoundingClientRect()
    //   this.size = rect.width
    //   const { styles } = this.state
    //   const baseline = (100 / this.props.row.length)
    //   const updates = Object.keys(styles).reduce((a, c) => {
    //     a[c] = (styles[c] / (styles[c] + baseline)) * 100
    //     return a
    //   }, {})

    //   console.log(updates)
    //   this.setState({ styles: updates })
    // }
  }

  componentWillUnmount () {
    window.removeEventListener('mousemove', this.onMouseMove)
    window.removeEventListener('mouseup', this.onDragEnd)
  }

  onDragStart = (evt, row, columnIndex) => {
    const left = row[columnIndex]
    const right = row[columnIndex + 1]
    this.setState({
      dragging: true,
      left: left,
      right: right
    })
  }

  onDragEnd = evt => {
    this.setState(prevState => {
      if (prevState.dragging) {
        return {
          dragging: false,
          left: undefined,
          right: undefined
        }
      }
      return null
    })
  }

  onMouseMove = evt => {
    if (!this.state.dragging) return
    const { left, right } = this.state
    const dx = evt.clientX - this.cache[right].offset
    //  const delta = (dx / this.size) * 100
    const leftWidth = ((this.cache[left].size + dx) / this.size) * 100
    const rightWidth = ((this.cache[right].size - dx) / this.size) * 100
    const styles = {
      ...this.state.styles,
      [left]: leftWidth,
      [right]: rightWidth
    }
    this.setState({ styles })
  }

  onMouseDown = evt => {}

  setSize = (key, rect) => {
    this.cache[key] = {}
    this.cache[key].size = rect.width
    this.cache[key].offset = rect.left
  }

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
              styles={this.state.styles}
              setSize={this.setSize}
              onDragStart={this.onDragStart}
            />
          ))}
        </div>
      </div>
    )
  }
}

export default DraftTable
