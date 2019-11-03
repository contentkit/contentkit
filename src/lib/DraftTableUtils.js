import { Block } from '@contentkit/util'
import groupBy from 'lodash.groupby'
import memoize from 'lodash.memoize'

export function getCells (editorState, tableBlockKey) {
  const block = editorState.getCurrentContent().getBlockForKey(tableBlockKey)
  if (!block || block.getType() !== Block.TABLE) return {}
  const tableRows = tableBlockKey
    ? [...block.getData().get('table')]
    : []
  return tableRows
}

export function getRows (editorState, tableBlockKey) {
  const block = editorState.getCurrentContent().getBlockForKey(tableBlockKey)
  if (!block || block.getType() !== Block.TABLE) return []
  const tableRows = tableBlockKey
    ? [...block.getData().get('table')]
    : []
  return groupBy(tableRows, v => v.row)
}

export const getDraftTableProps = memoize((editorState, tableBlockKey) => {
  const tableData = getCells(editorState, tableBlockKey)
  const tableRows = groupBy(tableData, 'row')
  return [tableData, tableRows]
})

export default {
  getCells,
  getRows,
  getDraftTableProps
}
