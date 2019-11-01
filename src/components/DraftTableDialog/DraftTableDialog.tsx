import React from 'react'
import PropTypes from 'prop-types'
import { updateDataOfBlock, Block } from '@contentkit/util'
import DraftTable from '../DraftTable'
import { Map } from 'immutable'
import { genKey } from 'draft-js'
import keyBy from 'lodash.keyby'
import groupBy from 'lodash.groupby'
import classes from './styles.scss'
import VerticalSplitIcon from '../VerticalSplitIcon'
import HorizontalSplitIcon from '../HorizontalSplitIcon'
import DraftTableUtils from '../../lib/DraftTableUtils'

import Modal from 'antd/lib/modal'

const Key = {
  BACKSPACE: 8,
  ENTER: 13,
  TAB: 9
}

const EDITING_INITIAL_STATE = {
  value: '',
  key: undefined,
  row: undefined
}

const getCells = (editorState, tableBlockKey) => {
  const block = editorState.getCurrentContent().getBlockForKey(tableBlockKey)
  if (!block || block.getType() !== Block.TABLE) return {}
  const tableRows = tableBlockKey
    ? [...block.getData().get('table')]
    : []
  return tableRows
}

class DraftTableDialog extends React.Component {

  static propTypes = {
    editorState: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    tableBlockKey: PropTypes.string,
    handleClose: PropTypes.func.isRequired
  }

  state = {
    selected: [],
    editing: EDITING_INITIAL_STATE,
    dragging: false
  }

  getRows = () => {
    const { editorState, tableBlockKey } = this.props
    const block = editorState.getCurrentContent().getBlockForKey(tableBlockKey)
    if (!block || block.getType() !== Block.TABLE) return []
    const tableRows = tableBlockKey
      ? [...block.getData().get('table')]
      : []
    return groupBy(tableRows, v => v.row)
  }

  onClickCell = (evt, key) => {
    const { dragging, editing, selected } = this.state
    if (dragging) return
    const { tableBlockKey, editorState } = this.props
    const block = editorState.getCurrentContent().getBlockForKey(tableBlockKey)
    const rows = block.getData().get('table') ? [...block.getData().get('table')] : []
    const table = keyBy(rows, 'key')

    if (editing.key) {
      table[editing.key].value = editing.value
      this.props.onChange(
        updateDataOfBlock(editorState, block, Map({
          table: Object.values(table)
        }))
      )
    }

    this.setState({
      editing: table[key],
      selected: evt.shiftKey ? selected.concat([key]) : [key]
    })
  }

  handleSave = () => {
    const { editing } = this.state
    const { tableBlockKey, editorState } = this.props
    const block = editorState.getCurrentContent().getBlockForKey(tableBlockKey)
    const rows = block.getData().get('table') ? [...block.getData().get('table')] : []
    const lookup = keyBy(rows, 'key')
    const cell = lookup[editing.key]

    if (!cell) return
    if (cell.value !== editing.value) {
      lookup[editing.key] = {
        ...cell,
        value: editing.value
      }
      this.props.onChange(
        updateDataOfBlock(editorState, block, Map({
          table: Object.values(lookup)
        }))
      )
    }
  }

  handleDelete = (evt, key) => {
    const { tableBlockKey, editorState } = this.props
    const { selected } = this.state
    const block = editorState.getCurrentContent().getBlockForKey(tableBlockKey)
    let rows = block.getData().get('table') ? [...block.getData().get('table')] : []

    const table = rows.filter(v => !selected.includes(v.key))
    this.props.onChange(
      updateDataOfBlock(editorState, block, Map({ table: table }))
    )
    this.setState({
      editing: EDITING_INITIAL_STATE,
      selected: []
    })
  }

  onChange = ({ target: { value } }) => {
    const { editing } = this.state
    this.setState({
      editing: {
        ...editing,
        value: value
      }
    })
  }

  insertColumn = () => {
    const { tableBlockKey, editorState } = this.props
    const block = editorState.getCurrentContent().getBlockForKey(tableBlockKey)
    const table = this.getRows()
    const newTable = Object.keys(table).flatMap(key =>
      table[key].concat({ colSpan: 1, rowSpan: 1, value: '', key: genKey(), row: key })
    )

    this.props.onChange(
      updateDataOfBlock(editorState, block, Map({
        table: newTable
      }))
    )
  }

  insertRow = () => {
    const { tableBlockKey, editorState } = this.props
    const { editing } = this.state
    const block = editorState.getCurrentContent().getBlockForKey(tableBlockKey)
    const table = this.getRows()
    let rows = block.getData().get('table') ? [...block.getData().get('table')] : []
    const row = table[editing.row]
    const nextRowKey = genKey()
    const newRows = Array.from({ length: row.length }).map(_ => ({
      key: genKey(),
      value: '',
      colSpan: 1,
      rowSpan: 1,
      row: nextRowKey
    }))
    this.props.onChange(
      updateDataOfBlock(editorState, block, Map({
        table: rows.concat(newRows)
      }))
    )
  }

  onTab = (evt, key) => {
    const { tableBlockKey, editorState } = this.props

    const block = editorState.getCurrentContent().getBlockForKey(tableBlockKey)
    const rows = [...block.getData().get('table')]
    const index = rows.findIndex(v => v.key === key)

    if (index >= 0 && index < rows.length) {
      evt.preventDefault()
      evt.stopPropagation()
      this.handleSave()
      const cell = rows[index + 1]
      this.setState({
        selected: [cell.key],
        editing: cell
      })
    }
  }

  onKeyDown = (evt, key) => {
    switch (evt.which) {
      case Key.ENTER:
        return this.handleSave(evt, key)
      case Key.BACKSPACE:
        if (this.state.editing.value === '') {
          return this.handleDelete(evt, key)
        }
        break
      case Key.TAB:
        return this.onTab(evt, key)
      default:
    }
  }

  onTableKeyDown = evt => {
    if (evt.which === Key.TAB) {
      evt.preventDefault()
      evt.stopPropagation()
      const { editing } = this.state
      const table = this.getRows()
      const row = table[editing.row]
      const index = row.findIndex(v => v.key === editing.key)
      this.setState({
        editing: row[index + 1] || EDITING_INITIAL_STATE
      })
    }
  }

  onFocus = (evt, key) => {
    if (this.state.dragging) return
    const { tableBlockKey, editorState } = this.props
    const block = editorState.getCurrentContent().getBlockForKey(tableBlockKey)
    const rows = block.getData().get('table')
    const table = keyBy(rows, 'key')

    this.setState({
      editing: table[key]
    })
  }

  onDragStart = evt => {
    this.setState({ dragging: true })
  }

  onDragEnd = evt => {
    this.setState({ dragging: false })
  }

  render () {
    const { dragging } = this.state
    const { editorState, tableBlockKey } = this.props

    const [tableData, tableRows] = DraftTableUtils.getDraftTableProps(editorState, tableBlockKey)
    return (
      <Modal
        visible={this.props.open}
        onCancel={this.props.handleClose}
        style={{ minWidth: '600px' }}
        onOk={
          evt => {
            this.props.handleClose()
          }
        }
        title={
          <div className={classes.modalTitle}>
            Title
            <div className={classes.buttonGroup}>
              <button onClick={this.insertColumn} className={classes.iconButton}>
                <VerticalSplitIcon />
              </button>
              <button onClick={this.insertRow} className={classes.iconButton}>
                <HorizontalSplitIcon />
              </button>
            </div>
          </div>
        }
      >
        <div className={classes.dialogContentRoot}>
          <DraftTable
            classes={classes}
            onTableKeyDown={this.onTableKeyDown}
            tableRows={tableRows}
            onKeyDown={this.onKeyDown}
            onClickCell={this.onClickCell}
            onChange={this.onChange}
            editing={this.state.editing}
            onFocus={this.onFocus}
            selected={this.state.selected}
            tableData={tableData}
            dragging={dragging}
            onDragStart={this.onDragStart}
            onDragEnd={this.onDragEnd}
          />
        </div>
      </Modal>
    )
  }
}

export default DraftTableDialog
