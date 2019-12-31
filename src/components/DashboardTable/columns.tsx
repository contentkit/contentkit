
import React from 'react'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import TableCellInput from './components/TableCellInput'
import TableCellSelect from './components/TableCellSelect'
import { Chip } from '@contentkit/components'
import { Column } from './types'

const formatDate = (str) => distanceInWordsToNow(new Date(str))

const columns : Column[] = [{
  title: 'Title',
  key: 'title',
  dataIndex: 'title',
  editable: true,
  render: x => x,
  Component: TableCellInput
}, {
  title: 'Status',
  key: 'status',
  dataIndex: 'status',
  editable: true,
  render: x => x,
  Component: TableCellSelect,
  getOptions: () => ([
    { key: 'DRAFT', label: 'DRAFT' },
    { key: 'PUBLISHED', label: 'PUBLISHED' }
  ])
}, {
  title: 'Project',
  key: 'project',
  dataIndex: 'project',
  render: (project) => project.name,
  editable: false
}, {
  title: 'Date',
  key: 'created_at',
  dataIndex: 'createdAt',
  editable: false,
  render: (date) => formatDate(date)
}, {
  title: 'Tags',
  key: 'posts_tags',
  dataIndex: 'tags',
  editable: false,
  render: (posts_tags) => {
    return posts_tags.map(({ tag }) => (
      <Chip key={tag.id} label={tag.name} style={{ marginRight: 8 }} />
    ))
  }
}]

export default columns
