// @flow
import * as React from 'react'
import PropTypes from 'prop-types'
import Header from '../../components/Header'
import AntdLayout from 'antd/lib/layout'

class Layout extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    logged: PropTypes.bool,
    loading: PropTypes.bool,
    render: PropTypes.func
  }

  render () {
    const { children, ...rest } = this.props
    return (
      <AntdLayout>
        <Header {...rest} />
        <AntdLayout.Content>
          {children}
        </AntdLayout.Content>
        <footer />
      </AntdLayout>
    )
  }
}

export default Layout
