import React from 'react'

const withConnectivity = Component =>
  class extends React.Component {
    state = {
      status: 'online'
    }
  
    componentDidMount () {
      window.addEventListener('online', this.handleStatus)
      window.addEventListener('offline', this.handleStatus)
    }
  
    componentWillUnmount () {
      window.removeEventListener('online', this.handleStatus)
      window.removeEventListener('offline', this.handleStatus)
    }
  
    handleStatus = ({ type }) => {
      window.requestIdleCallback(() => this.setState(() => {
        if (type !== this.state.status) {
          return null
        }
        return { status: type }
      }))
    }
  
    render () {
      return (
        <Component {...this.props} {...this.state} />
      )
    }
  }

export default withConnectivity
