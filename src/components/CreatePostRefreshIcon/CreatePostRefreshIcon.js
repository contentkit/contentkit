import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'

const RefreshIcon = () => (
  <div style={{position: 'relative', margin: 'auto 10px auto 0'}}>
    <CircularProgress
      size={30}
      style={{
        display: 'inline-block',
        position: 'relative'
      }}
    />
  </div>
)

export default RefreshIcon
