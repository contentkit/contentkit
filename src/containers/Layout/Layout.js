import * as React from 'react'
import PropTypes from 'prop-types'
import Header from '../../components/Header'
// import styles from './styles.scss'
import { CssBaseline } from '@material-ui/core'
import clsx from 'clsx'
import { withStyles } from '@material-ui/core/styles'

function Layout (props) {
  const { classes, children, className, ...rest } = props
  return (
    <div className={classes.root}>
      <CssBaseline />
      <Header {...rest} />
      <main className={classes.content}>
        <div className={
          clsx(classes.inner, className)
        }>
          {children}
        </div>
      </main>
    </div>
  )
}

Layout.propTypes = {
  history: PropTypes.object,
  logged: PropTypes.bool,
  loading: PropTypes.bool,
  render: PropTypes.func
}

const styles = theme => ({
  root: {
    backgroundColor: theme.variables.backgroundColor,
    minHeight: '100vh'
  },
  layout: {},
  footer: {},
  inner: {
    width: '100%',
    height: '100%',
    minHeight: 'calc(100vh - 133px)'
  },
  content: {
    display: 'flex',
    flexDirection: 'column'
  },
  [theme.breakpoints.up('md')]: {
    inner: {
      padding: theme.spacing(4)
    }
  }
})

export default withStyles(styles)(Layout)
