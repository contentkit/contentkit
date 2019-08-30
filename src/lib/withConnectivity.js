import React from 'react'
import { Provider, Consumer } from 'connectivity-provider'
import Icon from 'antd/lib/icon'
import notification from 'antd/lib/notification'

class OfflineNotification extends React.Component {
  componentDidUpdate (prevProps) {
    if (prevProps.online !== this.props.online) {
      notification.open({
        message: `You are ${this.props.online ? 'online' : 'offline'}`,
        icon: <Icon type='wifi' />
      })
    }
  }
  render () {
    return (
      this.props.children
    )
  }
}

const useConnectivity = Component => props => (
  <Provider>
    <Consumer>
      {state => (
        <OfflineNotification {...props} {...state}>
          <Component {...props} />
        </OfflineNotification>
      )}
    </Consumer>
  </Provider>
)

export default useConnectivity
