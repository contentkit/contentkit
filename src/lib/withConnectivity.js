import React from 'react'
// @ts-ignore
import { Provider, Consumer } from 'connectivity-provider'
import { Snackbar } from '@material-ui/core'

class OfflineNotification extends React.Component {
  state = {
    open: false
  }
  componentDidUpdate (prevProps) {
    if (prevProps.online !== this.props.online) {
      this.setState({ open: true })
    }
  }

  handleClose = evt => {
    this.setState({ open: false })
  }

  render () {
    const { open } = this.state
    return (
      <React.Fragment>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={open}
          autoHideDuration={6000}
          onClose={this.handleClose}
        >
          You are {this.props.online ? 'online' : 'offline'}
        </Snackbar>
        {this.props.children}
      </React.Fragment>
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
