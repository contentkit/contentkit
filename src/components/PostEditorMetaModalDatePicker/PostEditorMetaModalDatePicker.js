import React from 'react'
import styles from './styles.scss'
import Input from 'antd/lib/input'

class PostMetaDatePicker extends React.Component {
  state = {
    focused: false,
    value: ''
  }

  onFocusChange = ({ focused }) => {
    this.setState({ focused })
  }

  onChange = (evt) => {
    // const elements = evt.target.value.replace(/[^0-9]/g, '')
    // const format = [[0, 2], [2, 4], [4, 8]]
    // const value = format.map(c => elements.slice(...c))
    // const v = value.filter(c => c !== '' && !isNaN(c)).join('/')
    this.props.handleChange(evt.target.value)
  }

  render () {
    return (
      <div>
        <Input
          type='text'
          ref={
            ref => { this.ref = ref }
          }
          onChange={this.onChange}
          className={styles.input}
          value={this.props.value}
        />
      </div>
    )
  }
}

export default PostMetaDatePicker
