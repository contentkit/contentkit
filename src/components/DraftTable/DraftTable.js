import React from 'react'
import DraftTableRow from '../DraftTableRow'
import { Table, Input, Button, Popconfirm, Form } from 'antd';

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} is required.`,
            },
          ],
          initialValue: record[dataIndex],
        })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    );
  };

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
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

class DraftTable extends React.Component {
  onMouseDown = evt => {}

  handleSave = (obj) => {
    console.log(obj)
  }

  render () {
    const {
      classes,
      onTableKeyDown,
      tableRows,
      onKeyDown,
      onClickCell,
      onChange,
      editing,
      onFocus,
      selected
    } = this.props
    const dataSource = Object.keys(tableRows).map((key, index) => {
      const row = tableRows[key]
      const entry = { key: key }
      return row.reduce((a, c) => {
        a[c.column] = c.value
        return a
      }, entry)
    })
    if (!Object.values(tableRows).length) return null
    const firstRow = Object.values(tableRows)[0]
    const rawColumns = firstRow.map(({ column }, index) => ({
      dataIndex: column,
      title: column,
      width: `${Math.floor(index / firstRow.length)}%`,
      editable: true
    }))
  
    const columns = rawColumns.map(col => {
      if (!col.editable) {
        return col
      }
      console.log({ col })
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

    console.log({ dataSource, tableRows, columns })
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    }
    return (
      <div clsasName={classes.table} onKeyDown={onTableKeyDown}>
        {/* <div className={classes.tableBody}>
          {Object.values(tableRows).map((row, rowIndex) => (
            <DraftTableRow
              key={rowIndex}
              row={row}
              editing={editing}
              onChange={onChange}
              onClickCell={onClickCell}
              onKeyDown={onKeyDown}
              onFocus={onFocus}
              classes={classes}
              selected={selected}
            />
          ))}
        </div> */}
        <Table
          components={components}
          dataSource={dataSource}
          columns={columns}
          rowClassName={() => 'editable-row'}
        />
      </div>
    )
  }
}

export default DraftTable
