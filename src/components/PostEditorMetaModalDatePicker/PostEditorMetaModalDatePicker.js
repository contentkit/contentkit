import React from 'react'
import DateInput from 'draft-js-dates'

class PostMetaDatePicker extends React.Component {
  state = {
    focused: false
  }
  onFocusChange = ({ focused }) => {
    this.setState({ focused })
  }
  render () {
    return (
      <div>
        <DateInput
          editorState={this.props.dateInputState}
          onChange={this.props.handleDateInputChange}
        />
      </div>
    )
  }
}

export default PostMetaDatePicker
