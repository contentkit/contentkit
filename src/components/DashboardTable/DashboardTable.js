import React from 'react'
import PropTypes from 'prop-types'

import LazyLoad from '../LazyLoad'

import classes from './styles.scss'
import Table from 'antd/lib/table'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import classnames from 'classnames'
import Tag from 'antd/lib/tag'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import debounce from 'lodash.debounce'
import Icon from 'antd/lib/icon'
import Button from 'antd/lib/button'

export const UPDATE_POST_TITLE = gql`
  mutation ($id: ID!, $title: String!) {
    updatePostTitle(id: $id, title: $title) {
      id
      title
    }
  }
`

export const UPDATE_POST = gql`
  mutation (
    $id: ID!
    $title: String!
    $status: PostStatus
    $publishedAt: String
    $coverImageId: ID
    $projectId: ID
    $excerpt: String
  ) {
    updatePost(
      id: $id
      title: $title
      status: $status
      publishedAt: $publishedAt
      coverImageId: $coverImageId
      projectId: $projetId
      excerpt: $excerpt
    ) {
      id
      createdAt
      publishedAt
      title
      slug
      status
      excerpt
      project {
        id
        name
      }
      tags {
        id
        name
      }
    }
  }
`

const formatDate = (str) => distanceInWordsToNow(new Date(str))

const EditableContext = React.createContext()

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
)

const EditableFormRow = Form.create()(EditableRow)

class EditableCell extends React.Component {
  state = {
    editing: false,
  }

  componentDidMount () {
    setTimeout(() => {
      this.ref.onselectstart = () => {
        return false
      }
    }, 0)
  }

  toggleEdit = (evt) => {
    this.setState(prevState => ({
      editing: !prevState.editing
    }), () => {
      if (this.state.editing) {
        this.input.focus()
      } else {
        this.input.blur()
      }
    })
  }

  save = e => {
    const { record } = this.props
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return
      }
      this.toggleEdit()
      this.handleSave({ ...record, ...values })
    })
  }

  handleSave = debounce((data) => {
    this.props.handleSave(data)
  }, 500)

  renderSuffix = () => {
    return this.state.editing
      ? (<Button icon='save' className={classes.iconButton} onClick={this.save} />)
      : (<Button icon='edit' className={classes.iconButton} onClick={this.toggleEdit} />)
  }

  onFocus = evt => {
    if (!this.state.editing) {
      this.input.blur()
    }
  }

  navigate = evt => {
    if (this.state.editing) {
      return
    }

    evt.preventDefault()
    evt.stopPropagation()
    const { history, record } = this.props
    history.push(`/posts/${record.id}`)
  }

  renderCell = form => {
    this.form = form
    const { children, dataIndex, record, title } = this.props
    const { editing } = this.state
    return (
      <Form.Item className={classes.editable}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} is required.`
            }
          ],
          initialValue: record[dataIndex]
        })(
          <Input
            ref={node => (this.input = node)}
            onPressEnter={this.save}
            onFocus={this.onFocus}
            onClick={this.navigate}
            className={classnames(
              classes.editableInput,
              { [classes.editing]: editing }
            )}
            suffix={this.renderSuffix()}
          />
        )}
      </Form.Item>
    )
  }

  render () {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      onSelectChange,
      ...restProps
    } = this.props
    return (
      <td
        {...restProps}
        className={classes.cell}
        ref={ref => (this.ref = ref)}
      >
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    )
  }
}

class DashboardTable extends React.Component {
  static propTypes = {
    posts: PropTypes.object,
    projects: PropTypes.object,
    selectedPosts: PropTypes.array.isRequired,
    selectPosts: PropTypes.func.isRequired,
    renderToolbar: PropTypes.func.isRequired
  }

  onSelectChange = (evt, rowKey) => {
    evt.preventDefault()
    evt.stopPropagation()
    const { selectedPosts } = this.props
    const isSelected = selectedPosts.includes(rowKey)
    const selection = isSelected
      ? selectedPosts.filter(key => key !== rowKey)
      : evt.shiftKey
        ? selectedPosts.concat([rowKey])
        : [rowKey]
    this.props.selectPosts(selection)
  }

  handleSave = mutate => (post) => {
    mutate({
      variables: {
        id: post.id,
        title: post.title
      },
      optimisticResponse: {
        __typename: 'Mutation',
        updatePostTitle: {
          __typename: 'Post',
          ...post
        }
      }
    })
  }

  getColumns = (mutate) => {
    const columns = [{
      title: 'Title',
      key: 'title',
      dataIndex: 'title',
      editable: true
    }, {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      editable: false
    }, {
      title: 'Project',
      key: 'project',
      dataIndex: 'project',
      render: (project) => project.name,
      editable: false
    }, {
      title: 'Date',
      key: 'createdAt',
      dataIndex: 'createdAt',
      editable: false,
      render: (date) => formatDate(date)
    }, {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      editable: false,
      render: (tags) => {
        return tags.map(tag => (
          <Tag key={tag.id}>{tag.name}</Tag>
        ))
      }
    }].map(col => {
      if (!col.editable) {
        return col
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave(mutate),
          className: classes.cell,
          history: this.props.history
        })
      }
    })
    return columns
  }

  onRowClick = record => evt => {
    this.onSelectChange(evt, record.key)
  }

  onRow = (record, rowIndex) => {
    return {
      onClick: this.onRowClick(record),
      className: classnames({
        [classes.row]: true,
        [classes.selected]: this.props.selectedPosts.includes(record.id)
      })
    }
  }

  render () {
    const {
      feed,
      search
    } = this.props

    const dataSource = (feed?.data?.feed?.posts || []).map(row => ({ ...row, key: row.id }))
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    }
    return (
      <Mutation mutation={UPDATE_POST_TITLE}>
        {mutate => (
          <LazyLoad {...this.props} render={({ loading }) => (
            <div className={classes.wrapper}>
              <div className={classes.toolbar}>
                {this.props.renderToolbar(this.props)}
              </div>
              <Table
                dataSource={dataSource}
                columns={this.getColumns(mutate)}
                className={classes.table}
                loading={feed.loading || search.loading}
                pagination={false}
                components={components}
                onRow={this.onRow}
              />
            </div>
          )} />
        )}
      </Mutation>
    )
  }
}

export default DashboardTable
