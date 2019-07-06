import React from 'react'
import { Provider, Consumer } from 'connectivity-provider'
import Icon from 'antd/lib/icon'
import notification from 'antd/lib/notification'

function OfflineNotification (props) {
  React.useEffect(() => {
    notification.open({
      message: `You are ${props.online ? 'online' : 'offline'}`,
      icon: <Icon type='wifi' />
    })
  }, [props.online])

  return props.children
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
