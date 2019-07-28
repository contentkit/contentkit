import React from 'react'
import classes from './styles.scss'

function LinearProgress () {
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    let timerID = setTimeout(() => {
      setProgress(Math.min(100, progress + 10))
    }, 20)

    return () => {
      clearTimeout(timerID)
    }
  })
  return (
    <div className={classes.progress}>
      <div
        className={classes.progressInner}
        style={{
          width: `${progress}%`
        }}
      />
    </div>
  )
}

export default LinearProgress
