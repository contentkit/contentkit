// @flow
import React from 'react'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import ButtonWithSpinner from '../../../../components/ButtonWithSpinner'

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
  handleChange
}: props) => (
  <Input
    className={classes.input}
    inputProps={inputProps}
    disableUnderline
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
    onKeyDown={submitContent}
    onChange={handleChange}
  />
)

export default CreatePostInput
