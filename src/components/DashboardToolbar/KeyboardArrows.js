import React from 'react'
import Button from 'antd/lib/button'

function KeyboardArrows (props) {
  return (
    <>
      <Button onClick={props.handlePrev} icon={'left'} shape={'round'} />
      <Button onClick={props.handleNext} icon={'right'} shape={'round'} />
    </>
  )
}

export default KeyboardArrows
