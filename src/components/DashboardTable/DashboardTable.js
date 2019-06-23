import React from 'react'
import PropTypes from 'prop-types'

import LazyLoad from '../LazyLoad'

import classes from './styles.scss'
import Table from 'antd/lib/table'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'

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

  toggleEdit = () => {
    const editing = !this.state.editing
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus()
      }
    })
  }

  save = e => {
    const { record, handleSave } = this.props
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return
      }
      this.toggleEdit()
      handleSave({ ...record, ...values })
    })
  }

  renderCell = form => {
    this.form = form
    const { children, dataIndex, record, title } = this.props
    const { editing } = this.state
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} is required.`
            },
          ],
          initialValue: record[dataIndex],
        })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
      </Form.Item>
    ) : (
      <div
        className='editable-cell-value-wrap'
        style={{ paddingRight: 24 }}
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    )
  }

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    )
  }
}

const TableWrapper = props => (
  <div
    elevation={0}
    className={classes.wrapper}
  >
    {props.children}
  </div>
)

class DashboardTable extends React.Component {
  static propTypes = {
    posts: PropTypes.object,
    projects: PropTypes.object,
    selectedPost: PropTypes.object
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.props.selectPosts(selectedRowKeys)
  }

  handleSave = () => {

  }

  render () {
    const {
      feed
    } = this.props
    let allPosts = feed?.data?.feed?.posts
    if (!feed?.loading && !allPosts.length) {
      return false
    }

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
      editable: false
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
          handleSave: this.handleSave
        })
      }
    })

    const dataSource = (feed?.data?.feed?.posts || []).map(row => ({ ...row, key: row.id }))
    console.log(this.props)
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    }
    return (
      <LazyLoad {...this.props} render={({ loading }) => (
        <TableWrapper classes={classes}>
          <div className={classes.toolbar}>
            {this.props.renderToolbar(this.props)}
          </div>
          <Table
            dataSource={dataSource}
            columns={columns}
            className={classes.table}
            rowSelection={{
              selectedRowKeys: this.props.selectedPosts,
              onChange: this.onSelectChange
            }}
            loading={feed.loading}
            pagination={false}
            components={components}
            onRow={(record, rowIndex) => {
              return {
                onClick: evt => {
                  const rowKey = evt.target.parentElement.dataset.rowKey
                  const { selectedPosts } = this.props
                  const selection = selectedPosts.includes(rowKey)
                    ? selectedPosts.filter(key => key !== rowKey)
                    : selectedPosts.concat([rowKey])
                  this.onSelectChange(selection)
                }
              }
            }}
          />
        </TableWrapper>
      )} />
    )
  }
}

export default DashboardTable
