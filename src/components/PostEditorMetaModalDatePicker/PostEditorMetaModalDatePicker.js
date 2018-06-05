import React from 'react'
import 'react-dates/lib/css/_datepicker.css'
import { withAsync } from 'with-async-component'
const asyncComponent = withAsync(({ children, ...rest }) => <div>{children}</div>)

const _SingleDatePicker = asyncComponent(() => {
  return import('react-dates/esm/utils/registerCSSInterfaceWithDefaultTheme')
    .then(({ default: register }) => {
      register()
      return import('react-dates/esm/components/SingleDatePicker')
    })
})

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
        <_SingleDatePicker
          date={this.props.date}
          onDateChange={this.props.onDateChange}
          focused={this.state.focused}
          onFocusChange={this.onFocusChange}
          id='single-date-picker'
          numberOfMonths={1}
          small
          isOutsideRange={() => false}
        />
      </div>
    )
  }
}

export default PostMetaDatePicker
