import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import debounce from 'lodash.debounce'

const styles = {
  tooltip: {
    borderRadius: 3,
    display: 'inline-block',
    fontSize: 13,
    padding: '8px 21px',
    position: 'fixed',
    pointerEvents: 'none',
    transition: 'opacity 0.3s ease-out',
    zIndex: '999',
    backgroundColor: '#fff',
    color: '#4c6072',
    width: 300,
    height: 200,
    marginTop: 10,
    overflow: 'hidden'
  }
}

const closedStyle = {
  opacity: 0,
  visibility: 'hidden'
}

const openStyle = {
  opacity: 1,
  visibility: 'visible'
}

const round = n => Math.ceil(n / 10) * 10

const isProximate = (a, b) => round(a) === round(b)

const normalize = ({ left, top }) => ({ left: left - 500, top: top - 75 })

class Tooltip extends React.Component {
  state = {
    position: {
      left: -999,
      top: -999
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.open) {
      this.watch()
    }
  }

  componentDidMount () {
    if (this.props.open) {
      this.watch()
    }
  }

  componentWillUnmount () {
    if (this.listener) {
      this.listener = false
      window.removeEventListener('mousemove', this.handleMouseMove)
    }
  }

  watch = () => {
    if (!this.listener) {
      this.listener = true
      window.addEventListener('mousemove', this.handleMouseMove)
    }
  }

  handleMouseMove = debounce((evt) => {
    const x = evt.clientX
    const y = evt.clientY
    window.requestIdleCallback(() => {
      this.setState(prevState => {
        if (
          isProximate(x, prevState.position.left) &&
          isProximate(y, prevState.position.top)
        ) {
          return null
        }
        return {
          position: {
            left: x,
            top: y
          }
        }
      })
    })
  }, 200)

  render () {
    const { classes, open, placement, children, ...rest } = this.props
    const { position } = this.state
    return (
      <div
        className={classes.tooltip}
        style={{ ...(open ? openStyle : closedStyle), ...normalize(position) }}
        {...rest}
      >
        {this.props.children}
      </div>
    )
  }
}

export default withStyles(styles)(Tooltip)
