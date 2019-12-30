import React from 'react'
import { Sidebar } from '@contentkit/sidebar'
import { LayoutContainer, LayoutContent, AppWrapper } from '@contentkit/components'
import Editor from '@contentkit/prosemirror'
import './style.scss'

function Playground (props) {
  return (
    <AppWrapper>
      <Editor />
    </AppWrapper>
  )
}

export default Playground

