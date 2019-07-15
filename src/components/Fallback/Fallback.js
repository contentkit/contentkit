import React from 'react'
import PropTypes from 'prop-types'
import Spinner from '../Spinner'
import styles from './styles.scss'

function Fallback (props) {
  React.useEffect(() => {
    let start = Date.now()

    return () => {
      let end = Date.now()
      console.log(`Spend ${(end - start) / 1000}s in fallback`)
    }
  })
  return (
    <div className={styles.root}>
      <div>
        <Spinner />
      </div>
    </div>
  )
}

Fallback.propTypes = {}

Fallback.defaultProps = {}

export default Fallback
