import React from 'react'
import { SingleDatePicker } from 'react-dates'

class PostMetaDatePicker extends React.Component {
  state = {
    date: undefined,
    focused: false
  }
  render () {
    return (
      <div>
        <SingleDatePicker
          date={this.state.date}
          onDateChange={date => this.setState({ date })}
          focused={this.state.focused} // PropTypes.bool
          onFocusChange={({ focused }) => this.setState({ focused })} // PropTypes.func.isRequired
        />
      </div>
    )
  }
}

export default PostMetaDatePicker
