import React from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/themes/prism.css'

const CODE = `
fetch('https://contentkit.co/api/v1/project-id')
  .then(resp => resp.json())
`
const highlight = code =>
  Prism.highlight(code, Prism.languages.javascript, 'javascript')

class CodeSnippet extends React.Component {
  render () {
    let projectId = this.props.auth.user.projects[0].id
    let token = this.props.auth.user.secret
    const code = highlight(`
    fetch('https://contentkit.co/api/v1/${projectId}', {
      headers: {
        Authorization: 'Bearer ' + ${token},
        Accept: 'application/json'
      }
    })
      .then(resp => resp.json())
    `)
    return (
      <pre style={{overflow: 'hidden'}}>
        <code dangerouslySetInnerHTML={{ __html: code }} />
      </pre>
    )
  }
}

export default CodeSnippet
