import React from 'react'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import IconButton from '@material-ui/core/IconButton'

// const KeyboardArrowLeft = () => <span />
// const KeyboardArrowRight = () => <span />
const KeyboardArrows = props => (
  <React.Fragment>
    <IconButton onClick={props.handlePrev}>
      <KeyboardArrowLeft />
    </IconButton>
    <IconButton
      onClick={props.handleNext}>
      <KeyboardArrowRight />
    </IconButton>
  </React.Fragment>
)

export default KeyboardArrows
