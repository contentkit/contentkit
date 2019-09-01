// @flow
import React from 'react'
import PropTypes from 'prop-types'
import message from 'antd/lib/message'

function CreatePostSnackbar (props) {
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    if (props.open) {
      if (!visible) {
        setVisible(true, () => {
          message.info(`Creating a new project ${props.newProjectName}`)
        })
      }
    }
  }, [props.open])

  return null
}

export default CreatePostSnackbar
