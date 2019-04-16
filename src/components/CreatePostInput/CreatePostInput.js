// @flow
import React from 'react'
import InputAdornment from '@material-ui/core/InputAdornment'
import ButtonWithSpinner from '../ButtonWithSpinner'
import { withStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import InputBase from '@material-ui/core/InputBase'
import InputLabel from '@material-ui/core/InputLabel'

const Input = props => {
  const { label, classes, ...rest } = props

  return (
    <FormControl>
      <InputLabel shrink className={classes.inputBaseLabel}>
        {label}
      </InputLabel>
      <InputBase
        {...rest}
        classes={{
          root: classes.inputBaseRoot,
          input: classes.inputBase
        }}
      />
    </FormControl>
  )
}

const styles = theme => ({
  input: {
    boxSizing: 'border-box',
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 0
  },
  button: {
    border: 'none',
    boxShadow: 'none',
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    // marginRight: '-14px',
    lineHeight: '1.60',
    height: 40
  },
  adornmentRoot: {
    marginLeft: 0
  },
  adornmentPositionEnd: {
    marginLeft: 0
  },
  inputBaseRoot: {},
  inputBase: {
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.common.white,
    border: '1px solid #e8e8e8',
    fontSize: 16,
    padding: '10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderColor: '#2f54eb',
      borderTopLeftRadius: 4,
      borderBottomLeftRadius: 4,
      // boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    }
  },
  inputBaseLabel: {
    fontSize: 18
  }
})

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
      <InputAdornment
        position='end'
        classes={{
          positionEnd: classes.adornmentPositionEnd,
          root: classes.adornmentRoot
        }}>
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
        <Input
          inputRef={ref => {
            this.ref = ref
          }}
          className={classes.input}
          inputProps={inputProps}
          endAdornment={this.renderAdornment()}
          value={value}
          onChange={handleChange}
          fullWidth
          classes={classes}
        />
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(CreatePostInput)
