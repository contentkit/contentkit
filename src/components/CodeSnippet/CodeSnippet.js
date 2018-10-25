import React from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/themes/prism.css'

const highlight = code =>
  Prism.highlight(code, Prism.languages.javascript, 'javascript')

class CodeSnippet extends React.Component {
  render () {
    let user = this.props.user?.data?.user
    let projectId = (user?.projects?.length && user.projects[0].id) || ''
    const code = highlight(`
    fetch('https://contentkit.co/api/v1/${projectId}', {
      headers: {
        Authorization: 'Bearer ' + ${user?.secret || ''},
        Accept: 'application/json'
      }
    })
      .then(resp => resp.json())
    `)
    return (
      <pre style={{ overflow: 'hidden' }}>
        <code dangerouslySetInnerHTML={{ __html: code }} />
      </pre>
    )
  }
}

export default CodeSnippet
