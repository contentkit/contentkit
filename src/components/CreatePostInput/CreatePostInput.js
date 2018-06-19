// @flow
import React from 'react'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import ButtonWithSpinner from '../ButtonWithSpinner'
import { withStyles } from '@material-ui/core/styles'

const inputProps = {
  style: {
    height: '100%'
  }
}

interface props {
  classes: any,
  createPost: () => void,
  createNewPost: () => void,
  submitContent: () => void,
  value: string,
  handleChange: () => void
}

const CreatePostInput = ({
  classes,
  createPost,
  createNewPost,
  submitContent,
  value,
  handleChange,
  autoFocus
}: props) => (
  <Input
    className={classes.input}
    inputProps={inputProps}
    disableUnderline
    autoFocus
    endAdornment={
      <InputAdornment position='end' className={classes.adornment}>
        <ButtonWithSpinner
          className={classes.button}
          onClick={createNewPost}
          color='primary'
          variant='raised'
          loading={createPost.loading}
        >
        Create New
        </ButtonWithSpinner>
      </InputAdornment>
    }
    value={value}
    // onKeyDown={submitContent}
    onChange={handleChange}
  />
)

export default withStyles({
  input: {
    padding: '0 0 0 5px',
    boxSizing: 'border-box'
  },
  button: {
    border: 'none',
    boxShadow: 'none',
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0
  },
  adornment: {
    maxHeight: 'max-content'
  }
})(CreatePostInput)
