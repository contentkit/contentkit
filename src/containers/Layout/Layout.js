import * as React from 'react'
import PropTypes from 'prop-types'
import Header from '../../components/Header'
import AntdLayout from 'antd/lib/layout'
import styles from './styles.scss'
import classnames from 'classnames'


class Layout extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    logged: PropTypes.bool,
    loading: PropTypes.bool,
    render: PropTypes.func
  }

  render () {
    const { children, className, ...rest } = this.props
    return (
      <AntdLayout className={styles.root}>
        <Header {...rest} />
        <AntdLayout.Content className={styles.content}>
          <div className={
            classnames(styles.inner, className)
          }>
            {children}
          </div>
        </AntdLayout.Content>
        <AntdLayout.Footer className={styles.footer}>
        </AntdLayout.Footer>
      </AntdLayout>
    )
  }
}

export default Layout
