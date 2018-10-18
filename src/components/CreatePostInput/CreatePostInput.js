// @flow
import React from 'react'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import ButtonWithSpinner from '../ButtonWithSpinner'
import { withStyles } from '@material-ui/core/styles'

const styles = {
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
  },
  label: {
    left: 5,
    lineHeight: '1.4'
  }
}

const inputProps = {
  style: {
    height: '100%'
  }
}

type Props = {
  classes: any,
  createPost: () => void,
  createPostMutation: () => void,
  value: string,
  handleChange: () => void
}

type State = {
  autoFocus: boolean
}

class CreatePostInput extends React.Component<Props, State> {
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

  componentDidMount () {
    // this.ref.focus()
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
        <InputLabel
          htmlFor='create-post'
          className={classes.label}
          disableAnimation
        >
            Post Title
        </InputLabel>
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
          name={'create-post'}
          id={'create-post'}
        />
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(CreatePostInput)
