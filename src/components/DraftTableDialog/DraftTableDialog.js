import React from 'react'
import PropTypes from 'prop-types'
import VerticalSplit from '@material-ui/icons/VerticalSplit'
import HorizontalSplit from '@material-ui/icons/HorizontalSplit'
import IconButton from '@material-ui/core/IconButton'
import { updateDataOfBlock, Block } from '@contentkit/util'
import DraftTable from '../DraftTable'
import { Map } from 'immutable'
import { genKey } from 'draft-js'
import keyBy from 'lodash.keyby'
import groupBy from 'lodash.groupby'
import classes from './styles.scss'

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

  ref = React.createRef()

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
    if (this.state.dragging) return
    const { tableBlockKey, editorState } = this.props
    const block = editorState.getCurrentContent().getBlockForKey(tableBlockKey)
    const rows = block.getData().get('table') ? [...block.getData().get('table')] : []
    const lookup = keyBy(rows, 'key')

    if (this.state.editing.key) {
      lookup[this.state.editing.key].value = this.state.editing.value
      this.props.onChange(
        updateDataOfBlock(this.props.editorState, block, Map({
          table: Object.values(lookup)
        }))
      )
    }

    const selected = evt.shiftKey ? this.state.selected.concat([key]) : [key]
    this.setState({
      editing: lookup[key],
      selected: selected
    })
  }

  handleSave = (evt) => {
    const { tableBlockKey } = this.props
    const block = this.props.editorState.getCurrentContent().getBlockForKey(tableBlockKey)
    const rows = block.getData().get('table') ? [...block.getData().get('table')] : []
    const lookup = keyBy(rows, 'key')
    const cell = lookup[this.state.editing.key]
    if (!cell) return
    if (cell.value !== this.state.editing.value) {
      lookup[this.state.editing.key] = {
        ...cell,
        value: this.state.editing.value
      }
      this.props.onChange(
        updateDataOfBlock(this.props.editorState, block, Map({
          table: Object.values(lookup)
        }))
      )
    }
  }

  handleDelete = (evt, key) => {
    const { tableBlockKey, editorState } = this.props
    const block = editorState.getCurrentContent().getBlockForKey(tableBlockKey)
    let rows = block.getData().get('table') ? [...block.getData().get('table')] : []

    const table = rows.filter(v => !this.state.selected.includes(v.key))
    this.props.onChange(
      updateDataOfBlock(editorState, block, Map({ table: table }))
    )
    this.setState({
      editing: EDITING_INITIAL_STATE,
      selected: []
    })
  }

  onChange = ({ target: { value } }) => {
    this.setState({
      editing: {
        ...this.state.editing,
        value: value
      }
    })
  }

  insertColumn = () => {
    const { tableBlockKey } = this.props
    const block = this.props.editorState.getCurrentContent().getBlockForKey(tableBlockKey)
    const table = this.getRows()
    const newTable = Object.keys(table).flatMap(key =>
      table[key].concat({ colSpan: 1, rowSpan: 1, value: '', key: genKey(), row: key })
    )

    this.props.onChange(
      updateDataOfBlock(this.props.editorState, block, Map({
        table: newTable
      }))
    )
  }

  insertRow = () => {
    const { tableBlockKey } = this.props
    const block = this.props.editorState.getCurrentContent().getBlockForKey(tableBlockKey)
    const table = this.getRows()
    let rows = block.getData().get('table') ? [...block.getData().get('table')] : []
    const row = table[this.state.editing.row]
    const nextRowKey = genKey()
    const newRows = Array.from({ length: row.length }).map(_ => ({
      key: genKey(),
      value: '',
      colSpan: 1,
      rowSpan: 1,
      row: nextRowKey
    }))
    this.props.onChange(
      updateDataOfBlock(this.props.editorState, block, Map({
        table: rows.concat(newRows)
      }))
    )
  }

  onTab = (evt, key) => {
    const { tableBlockKey } = this.props

    const block = this.props.editorState.getCurrentContent().getBlockForKey(tableBlockKey)
    const rows = [...block.getData().get('table')]
    let index = rows.findIndex(v => v.key === key)
    if (index && index < rows.length) {
      evt.preventDefault()
      evt.stopPropagation()
      this.handleSave(evt)
      let cell = rows[index + 1]
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
      const table = this.getRows()
      const row = table[this.state.editing.row]
      const index = row.findIndex(v => v.key === this.state.editing.key)
      const editing = row[index + 1] || EDITING_INITIAL_STATE
      this.setState({
        editing: editing
      })
    }
  }

  onFocus = (evt, key) => {
    if (this.state.dragging) return
    const { tableBlockKey, editorState } = this.props
    const block = editorState.getCurrentContent().getBlockForKey(tableBlockKey)
    const rows = block.getData().get('table')
    const lookup = keyBy(rows, 'key')

    this.setState({
      editing: lookup[key]
    })
  }

  render () {
    const tableData = getCells(this.props.editorState, this.props.tableBlockKey)
    const tableRows = groupBy(tableData, 'row')
    return (
      <Modal
        visible={this.props.open}
        onCancel={this.props.handleClose}
        style={{ minHeight: '600px' }}
        title={
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            Title
            <div>
              <IconButton onClick={this.insertColumn}>
                <VerticalSplit />
              </IconButton>
              <IconButton onClick={this.insertRow}>
                <HorizontalSplit />
              </IconButton>
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
            dragging={this.state.dragging}
            onDragStart={evt => {
              this.setState({ dragging: true })
            }}
            onDragEnd={evt => {
              this.setState({ dragging: false })
            }}
          />
        </div>
      </Modal>
    )
  }
}

export default DraftTableDialog
