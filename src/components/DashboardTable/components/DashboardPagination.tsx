import React from 'react'
import { Toolbar, IconButton } from '@material-ui/core'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons'
import { PaginationDirection } from '../types'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
  pagination: {
    justifyContent: 'flex-end'
  }
}))

function DashboardPagination (props) {
  const classes = useStyles(props)
  const { getNextPage } = props
  return (
    <Toolbar disableGutters className={classes.pagination}>
      <IconButton onClick={evt => getNextPage(PaginationDirection.BACKWARD)}>
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton onClick={evt => getNextPage(PaginationDirection.FORWARD)}>
        <KeyboardArrowRight />
      </IconButton>
    </Toolbar>
  )
}

export default DashboardPagination
