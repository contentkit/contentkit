import React from 'react'
import PropTypes from 'prop-types'
// @ts-ignore
import Spinner from '../Spinner'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
}))

function Fallback (props: any) {
  const classes = useStyles(props)
  React.useEffect(() => {
    let start = Date.now()

    return () => {
      let end = Date.now()
      console.log(`Spend ${(end - start) / 1000}s in fallback`)
    }
  })
  return (
    <div className={classes.root}>
      <div>
        <Spinner />
      </div>
    </div>
  )
}

Fallback.propTypes = {}

Fallback.defaultProps = {}

export default Fallback
