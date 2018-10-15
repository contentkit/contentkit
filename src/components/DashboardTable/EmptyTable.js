// @flow
import React from 'react'
import Typography from '@material-ui/core/Typography'
import DefaultPaper from '../DefaultPaper'

const styles = {
  height: '30vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
}

const EmptyTable = () => (
  <DefaultPaper>
    <div style={styles}>
      <Typography variant='h3' gutterBottom>
        This project doesn't have any posts to display yet :(
      </Typography>
    </div>
  </DefaultPaper>
)

export default EmptyTable
