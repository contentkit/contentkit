
import React from 'react'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import TableCellInput from './components/TableCellInput'
import TableCellSelect from './components/TableCellSelect'
import { Chip } from '@contentkit/components'
import { Column } from './types'

const formatDate = (str) => formatDistanceToNow(new Date(str))

const columns : Column[] = [{
  title: 'Title',
  key: 'title',
  dataIndex: 'title',
  editable: true,
  render: row => [row.title, { slug: `/posts/${row.id}` }],
  Component: TableCellInput,
  getProps: (row) => ({ slug: `/posts/${row.id}` })
}, {
  title: 'Status',
  key: 'status',
  dataIndex: 'status',
  editable: true,
  render: row => [row.status]
  Component: TableCellSelect,
  getOptions: () => ([
    { key: 'DRAFT', label: 'DRAFT' },
    { key: 'PUBLISHED', label: 'PUBLISHED' }
  ])
}, {
  title: 'Project',
  key: 'project',
  dataIndex: 'project',
  render: (row) => [row.project.name],
  editable: false
}, {
  title: 'Date',
  key: 'created_at',
  dataIndex: 'createdAt',
  editable: false,
  render: (row) => [formatDate(row.created_at)]
}, {
  title: 'Tags',
  key: 'posts_tags',
  dataIndex: 'tags',
  editable: false,
  render: ({ posts_tags }) => {
    const chips = posts_tags.map(({ tag }) => (
      <Chip key={tag.id} label={tag.name} style={{ marginRight: 8, backgroundColor: '#48BB78' }} />
    ))
    return [chips]
  }
}]

export default columns
