import React from 'react'
import Button from 'antd/lib/button'

const KeyboardArrows = props => (
  <React.Fragment>
    <Button onClick={props.handlePrev} icon={'left'} shape={'round'} />
    <Button onClick={props.handleNext} icon={'right'} shape={'round'} />
  </React.Fragment>
)

export default KeyboardArrows
