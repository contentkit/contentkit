import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import './styles.scss'

class DraftTableCell extends React.Component {
  static PropTypes = {
    cell: PropTypes.object.isRequired,
    setSize: PropTypes.func.isRequired,
    selected: PropTypes.array.isRequired,
    editing: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onClickCell: PropTypes.func.isRequired,
    onKeyDown: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired
  }

  inputRef = React.createRef()
  containerRef = React.createRef()

  componentDidMount () {
    this.props.setSize(this.props.cell.key, this.containerRef.current.getBoundingClientRect())
  }

  componentDidUpdate = (prevProps, prevState) => {
    const { cell: { key } } = this.props
    if (prevProps.editing.key !== this.props.editing.key) {
      if (this.props.editing.key === key) {
        return this.inputRef.current.focus()
      }

      this.inputRef.current.blur()
    }

    if (prevProps.dragging !== this.props.dragging) {
      this.props.setSize(key, this.containerRef.current.getBoundingClientRect())
    }
  }

  onBlur = evt => {
    // this.props.onBlur(evt, this.props.cell.key)
  }

  onFocus = evt => {
    this.props.onFocus(evt, this.props.cell.key)
  }

  render () {
    const {
      cell,
      selected,
      onChange,
      onClickCell,
      onKeyDown,
      classes,
      index,
      editing
    } = this.props
    const isEditing = editing.key === cell.key
    const value = isEditing ? editing.value : cell.value
    const isSelected = selected.includes(cell.key)
    return (
      <div
        onMouseDown={evt => onClickCell(evt, cell.key)}
        className={classnames(classes.tableCell, { selected: isSelected, editing: isEditing })}
        ref={this.containerRef}
        style={{
          width: `${this.props.width}%`
        }}
        data-key={cell.key}
      >
        <input
          value={value}
          onChange={evt => onChange(evt, cell.key)}
          disabled={!editing}
          onKeyDown={evt => onKeyDown(evt, cell.key)}
          onBlur={this.onBlur}
          ref={this.inputRef}
          onFocus={this.onFocus}
          className={classnames('input')}
          tabIndex={index}
        />
        {this.props.children}
      </div>
    )
  }
}

export default DraftTableCell
