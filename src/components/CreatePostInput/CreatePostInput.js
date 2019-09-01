import React from 'react'
import ButtonWithSpinner from '../ButtonWithSpinner'
import classes from './styles.scss'
import Input from 'antd/lib/input'
import classnames from 'classnames'

function CreatePostInput (props) {
  const [value, setValue] = React.useState('')
  const [focused, setFocused] = React.useState('')

  const renderAdornment = () => {
    const {
      createPost,
      loading
    } = props
    return (
      <ButtonWithSpinner
        className={
          classnames(
            'ant-input-search-button',
            classes.button, {
              [classes.focused]: focused
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

  const handleChange = (evt) => {
    setValue(evt.target.value)
  }

  const handleFocus = () => setFocused(true)

  const handleBlur = () => setFocused(false)

  const {
    createPost
  } = props
  return (
    <Input
      className={
        classnames(
          classes.input,
          'ant-input-search',
          'ant-input-search-enter-button',
          'ant-input-search-large'
        )
      }
      addonAfter={renderAdornment()}
      value={value}
      onChange={handleChange}
      type={'text'}
      onPressEnter={createPost}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  )
}

export default CreatePostInput
