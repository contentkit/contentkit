// @flow
import React from 'react'
import PropTypes from 'prop-types'
import message from 'antd/lib/message'

class CreatePostSnackbar extends React.Component {
  render () {
    return null
  }

  componentDidUpdate(prevProps) {
    if (this.props.open) {
      if (!prevProps.open) {
        message.info(`Creating a new project ${this.props.newProjectName}`)
      }
    }
  }
}

export default CreatePostSnackbar
