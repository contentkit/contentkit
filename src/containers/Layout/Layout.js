// @flow
import * as React from 'react'
import PropTypes from 'prop-types'
import Header from '../../components/Header'

class Layout extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    logged: PropTypes.bool,
    loading: PropTypes.bool,
    render: PropTypes.func
  }

  state = {
    anchorEl: null
  }

  setAnchorEl = ({ currentTarget }: { currentTarget: any }) =>
    this.setState({ anchorEl: currentTarget })

  render () {
    const { children, ...rest } = this.props
    return (
      <div>
        <Header
          {...rest}
          {...this.state}
          setAnchorEl={this.setAnchorEl}
        />
        {children}
        <footer />
      </div>
    )
  }
}

export default Layout
