
import React from 'react'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import TableCellInput from './components/TableCellInput'
import TableCellSelect from './components/TableCellSelect'
import { Chip } from '@contentkit/components'
import { Column } from './types'
import { makeStyles } from '@material-ui/styles'

const ASSET_PREFIX = 'https://s3.amazonaws.com/contentkit/'

const formatDate = (str) => formatDistanceToNow(new Date(str))

const useStyles = makeStyles(theme => ({
  root: {
    width: 40,
    height: 40,
    boxShadow: '0px 4px 8px rgba(60,45,111,0.1), 0px 1px 3px rgba(60,45,111,0.15)'
  },
  thumbnail: {
    objectFit: 'cover',
    height: '100%',
    width: '100%'
  }
}))

function Thumbail (props) {
  const classes = useStyles(props)
  const { image } = props
  return (
    <figure className={classes.root}>
      <img className={classes.thumbnail} src={`${ASSET_PREFIX}${image.url}`} />
    </figure>
  )
}

const columns: Column[] = [{
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
},{
  title: 'Image',
  key: 'image',
  dataIndex: 'image',
  editable: false,
  render: (row) => {
    console.log(row)
    if (!row?.image?.id) return ['']
    return [
      <Thumbail image={row.image} />
    ]
  }
}]

export default columns
