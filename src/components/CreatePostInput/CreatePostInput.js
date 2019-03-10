// @flow
import React from 'react'
import InputAdornment from '@material-ui/core/InputAdornment'
import ButtonWithSpinner from '../ButtonWithSpinner'
import { withStyles } from '@material-ui/core/styles'

import OutlinedInput from '@material-ui/core/OutlinedInput'

const styles = {
  input: {
    boxSizing: 'border-box',
  },
  button: {
    border: 'none',
    boxShadow: 'none',
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    marginRight: '-14px'
  },
  adornment: {
  },
  label: {
  }
}

const inputProps = {
  style: {
    height: '100%'
  }
}

class CreatePostInput extends React.Component {
  state = {
    autoFocus: true,
    value: ''
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.value !== this.props.value ||
    nextProps.loading !== this.props.loading ||
    nextState.value !== this.state.value
  }

  renderAdornment = () => {
    const {
      classes,
      createPost,
      loading
    } = this.props
    return (
      <InputAdornment position='end' className={classes.adornment}>
        <ButtonWithSpinner
          className={classes.button}
          onClick={createPost}
          color='primary'
          variant='contained'
          loading={loading}
        >
          Create
        </ButtonWithSpinner>
      </InputAdornment>
    )
  }

  handleChange = (evt) => {
    this.setState({ value: evt.target.value })
  }

  render () {
    const {
      classes,
      value,
      handleChange
    } = this.props
    return (
      <React.Fragment>
        <OutlinedInput
          inputRef={ref => {
            this.ref = ref
          }}
          className={classes.input}
          inputProps={inputProps}
          endAdornment={this.renderAdornment()}
          value={value}
          onChange={handleChange}
          name={'create-post'}
          id={'create-post'}
          labelWidth={0}
        />
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(CreatePostInput)
