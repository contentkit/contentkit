import React from 'react'
import { IconButton } from '@material-ui/core'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons'

function KeyboardArrows (props) {
  return (
    <>
      <IconButton onClick={props.handlePrev}>
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton onClick={props.handleNext}>
        <KeyboardArrowRight />
      </IconButton>
    </>
  )
}

export default KeyboardArrows
