// @flow
import React from 'react'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import ButtonWithSpinner from '../ButtonWithSpinner'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

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

class CreatePostInput extends React.Component {
  state = {
    autoFocus: true
  }
  renderAdornment = () => {
    const {
      classes,
      createNewPost,
      createPost
    } = this.props
    return (
      <InputAdornment position='end' className={classes.adornment}>
        <Button
          className={classes.button}
          onClick={createNewPost}
          color='primary'
          variant='raised'
          loading={createPost.loading}
        >
          Create New
        </Button>
      </InputAdornment>
    )
  }

  componentDidUpdate () {
    this.ref.focus()
  }

  render () {
    const {
      classes,
      createPost,
      createNewPost,
      submitContent,
      value,
      handleChange
    } = this.props
    return (
      <Input
        inputRef={ref => {
          this.ref = ref
        }}
        className={classes.input}
        inputProps={inputProps}
        disableUnderline
        endAdornment={this.renderAdornment()}
        value={value}
        onChange={handleChange}
      />
    )
  }
}

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
