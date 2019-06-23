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

export const UPDATE_POST = gql`
  mutation (
    $id: ID!
    $title: String!
    $status: PostStatus
    $publishedAt: String
  ) {
    updatePost(
      id: $id
      title: $title
      status: $status
      publishedAt: $publishedAt
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
      <td {...restProps} className={classes.cell}>
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
    selectedPost: PropTypes.object
  }

  onSelectChange = (rowKey) => {
    const { selectedPosts } = this.props
    const selection = selectedPosts.includes(rowKey)
      ? selectedPosts.filter(key => key !== rowKey)
      : selectedPosts.concat([rowKey])
    this.props.selectPosts(selection)
  }

  handleSave = () => {

  }

  getColumns = (handleSave) => {
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
          handleSave: handleSave,
          className: classes.cell
        })
      }
    })
    return columns
  }

  render () {
    const {
      feed
    } = this.props
    let allPosts = feed?.data?.feed?.posts
    if (!feed?.loading && !allPosts.length) {
      return false
    }

    const dataSource = (feed?.data?.feed?.posts || []).map(row => ({ ...row, key: row.id }))
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    }
    return (
      <Mutation mutation={UPDATE_POST}>
        {mutate => (
          <LazyLoad {...this.props} render={({ loading }) => (
            <div className={classes.wrapper}>
              <div className={classes.toolbar}>
                {this.props.renderToolbar(this.props)}
              </div>
              <Table
                dataSource={dataSource}
                columns={this.getColumns((post) => {
                  mutate({
                    variables: {
                      id: post.id,
                      title: post.title
                    },
                    optimisticResponse: {
                      __typename: 'Mutation',
                      updatePost: {
                        __typename: 'Post',
                        ...post
                      }
                    }
                  })
                })}
                className={classes.table}
                loading={feed.loading}
                pagination={false}
                components={components}
                onRow={(record, rowIndex) => {
                  return {
                    onClick: evt => {
                      this.onSelectChange(record.key)
                    },
                    className: classnames({
                      [classes.row]: true,
                      [classes.selected]: this.props.selectedPosts.includes(record.id)
                    })
                  }
                }}
              />
            </div>
          )} />
        )}
      </Mutation>
    )
  }
}

export default DashboardTable
