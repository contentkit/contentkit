// @flow
import React, { ReactElement } from 'react'
import PropTypes from 'prop-types'
import Header from '../../components/Header'

class Layout extends React.Component<{
  history: any,
  logged: bool,
  loading: bool,
  render: () => React$ComponentType<*>,
  children: Array<React$Node>
}> {
  // shouldComponentUpdate (nextProps) {
  //  return nextProps.logged !== this.props.logged ||
  //    nextProps.loading !== this.props.loading
  // }

  static propTypes = {
    history: PropTypes.object,
    logged: PropTypes.bool,
    loading: PropTypes.bool,
    render: PropTypes.func
  }

  state = {
    anchorEl: null
  }

  setAnchorEl = ({ currentTarget }: { currentTarget: any }) => this.setState({ anchorEl: currentTarget })

  render () {
    const { children, ...rest } = this.props
    return (
      <div>
        <Header
          {...rest}
          {...this.state}
          setAnchorEl={this.setAnchorEl}
        />
        <article>
          {children}
        </article>
        <footer />
      </div>
    )
  }
}

export default Layout
