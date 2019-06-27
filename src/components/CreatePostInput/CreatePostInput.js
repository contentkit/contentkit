import React from 'react'
import ButtonWithSpinner from '../ButtonWithSpinner'
import classes from './styles.scss'
import Input from 'antd/lib/input'
import classnames from 'classnames'

class CreatePostInput extends React.Component {
  state = {
    value: '',
    focused: false
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.value !== this.props.value ||
    nextProps.loading !== this.props.loading ||
    nextState.value !== this.state.value ||
    nextState.focused !== this.state.focused
  }

  renderAdornment = () => {
    const {
      createPost,
      loading
    } = this.props
    return (
      <ButtonWithSpinner
        className={
          classnames(
            'ant-input-search-button',
            classes.button, {
              [classes.focused]: this.state.focused
            }
          )
        }
        onClick={createPost}
        loading={loading}
      >
        New Post
      </ButtonWithSpinner>
    )
  }

  handleChange = (evt) => {
    this.setState({ value: evt.target.value })
  }

  render () {
    const {
      value,
      handleChange,
      createPost
    } = this.props
    return (
      <Input
        ref={ref => {
          this.ref = ref
        }}
        className={
          classnames(
            classes.input,
            'ant-input-search',
            'ant-input-search-enter-button',
            'ant-input-search-large'
          )
        }
        addonAfter={this.renderAdornment()}
        value={value}
        onChange={handleChange}
        type={'text'}
        onPressEnter={createPost}
        onFocus={
          evt => this.setState({ focused: true })
        }
        onBlur={
          evt => this.state({ focused: false })
        }
      />
    )
  }
}

export default CreatePostInput
