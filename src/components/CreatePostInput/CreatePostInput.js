import React from 'react'
import ButtonWithSpinner from '../ButtonWithSpinner'
import classes from './styles.scss'
import Input from 'antd/lib/input'
import classnames from 'classnames'

class CreatePostInput extends React.Component {
  state = {
    value: ''
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.value !== this.props.value ||
    nextProps.loading !== this.props.loading ||
    nextState.value !== this.state.value
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
      />
    )
  }
}

export default CreatePostInput
