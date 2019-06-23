import React from 'react'
import createAsyncLoadingHighlighter from 'react-syntax-highlighter/dist/esm/async-syntax-highlighter';
import supportedLanguages from 'react-syntax-highlighter/dist/esm/languages/prism/supported-languages';
import classes from './styles.scss'

const SyntaxHighlighter = createAsyncLoadingHighlighter({
  loader: () => import('refractor').then(module => module.default || module),
  noAsyncLoadingLanguages: true,
  supportedLanguages
})

const style = {
  "code[class*=\"language-\"]":{
    "fontFamily":"Roboto Mono, Consolas, Menlo, Monaco, \"Andale Mono WT\", \"Andale Mono\", \"Lucida Console\", \"Lucida Sans Typewriter\", \"DejaVu Sans Mono\", \"Bitstream Vera Sans Mono\", \"Liberation Mono\", \"Nimbus Mono L\", \"Courier New\", Courier, monospace",
    "fontSize":"14px",
    "lineHeight":"1.574",
    "direction":"ltr",
    "textAlign":"left",
    "whiteSpace":"pre",
    "wordSpacing":"normal",
    "wordBreak":"normal",
    "MozTabSize":"2",
    "OTabSize":"2",
    "tabSize":"2",
    "WebkitHyphens":"none",
    "MozHyphens":"none",
    "msHyphens":"none",
    "hyphens":"none",
    "background":"none",
    "color":"#24DA8D"
  },
  "pre[class*=\"language-\"]":{
    "fontFamily":"Consolas, Menlo, Monaco, \"Andale Mono WT\", \"Andale Mono\", \"Lucida Console\", \"Lucida Sans Typewriter\", \"DejaVu Sans Mono\", \"Bitstream Vera Sans Mono\", \"Liberation Mono\", \"Nimbus Mono L\", \"Courier New\", Courier, monospace",
    "fontSize":"14px",
    "lineHeight":"1.375",
    "direction":"ltr",
    "textAlign":"left",
    "whiteSpace":"pre",
    "wordSpacing":"normal",
    "wordBreak":"normal",
    "MozTabSize":"4",
    "OTabSize":"4",
    "tabSize":"4",
    "WebkitHyphens":"none",
    "MozHyphens":"none",
    "msHyphens":"none",
    "hyphens":"none",
   // "background":"#2a2734",
    "color":"#9a86fd",
    "padding":"1em",
    "margin":".5em 0",
    "overflow":"auto"
  },
  "pre[class*=\"language-\"]::-moz-selection":{
    "textShadow":"none",
    // "background":"#6a51e6"
  },
  "pre[class*=\"language-\"] ::-moz-selection":{
    "textShadow":"none",
    // "background":"#6a51e6"
  },
  "code[class*=\"language-\"]::-moz-selection":{
    "textShadow":"none",
    "background":"#6a51e6"
  },"code[class*=\"language-\"] ::-moz-selection":{
    "textShadow":"none",
    // "background":"#6a51e6"
  },
  "pre[class*=\"language-\"]::selection":{
    "textShadow":"none",
    // "background":"#6a51e6"
  },
  "pre[class*=\"language-\"] ::selection":{
    "textShadow":"none",
    "background":"#6a51e6"
  },
  "code[class*=\"language-\"]::selection":{
    "textShadow":"none",
    // "background":"#6a51e6"
  },
  "code[class*=\"language-\"] ::selection":{
    "textShadow":"none",
    "background":"#6a51e6"
  },
  ":not(pre) > code[class*=\"language-\"]":{
    "padding":".1em",
    "borderRadius":".3em"
  },
  "comment":{
    "color":"#8FA6B2"
  },
  "prolog":{
    "color":"#fff"
  },
  "doctype":{
    "color":"#6c6783"
  },
  "cdata":{
    "color":"#6c6783"
  },
  "punctuation":{"color":"#8FA6B2"},"namespace":{"Opacity":".7"},"tag":{"color":"#e09142"},"operator":{"color":"#e09142"},"number":{"color":"#e09142"},"property":{"color":"#6FBCFF"},"function":{"color":"#6FBCFF"},"tag-id":{"color":"#eeebff"},"selector":{"color":"#eeebff"},"atrule-id":{"color":"#eeebff"},"code.language-javascript":{"color":"#c4b9fe"},"attr-name":{"color":"#c4b9fe"},"code.language-css":{"color":"#ffcc99"},"code.language-scss":{"color":"#ffcc99"},"boolean":{"color":"#ffcc99"},"string":{"color":"#FFE376"},"entity":{"color":"#6FBCFF"},"url":{"color":"#ffcc99"},".language-css .token.string":{"color":"#ffcc99"},".language-scss .token.string":{"color":"#ffcc99"},".style .token.string":{"color":"#ffcc99"},"attr-value":{"color":"#24DA8D"},"keyword":{"color":"#FF92F0"},"control":{"color":"#ffcc99"},"directive":{"color":"#ffcc99"},"unit":{"color":"#ffcc99"},"statement":{"color":"#ffcc99"},"regex":{"color":"#ffcc99"},"atrule":{"color":"#ffcc99"},"placeholder":{"color":"#ffcc99"},"variable":{"color":"#24DA8D"},"deleted":{"textDecoration":"line-through"},"inserted":{"borderBottom":"1px dotted #eeebff","textDecoration":"none"},"italic":{"fontStyle":"italic"},"important":{"fontWeight":"bold","color":"#c4b9fe"},"bold":{"fontWeight":"bold"},"pre > code.highlight":{"Outline":".4em solid #8a75f5","OutlineOffset":".4em"},".line-numbers .line-numbers-rows":{"borderRightColor":"#2c2937"},".line-numbers-rows > span:before":{"color":"#3c3949"},".line-highlight":{"background":"linear-gradient(to right, rgba(224, 145, 66, 0.2) 70%, rgba(224, 145, 66, 0))"},"constant":{"color":"#24DA8D"},"typedef":{"color":"#FFB054"}}

class CodeSnippet extends React.Component {
  render () {
    let user = this.props.user?.data?.user
    let projectId = (user?.projects?.length && user.projects[0].id) || ''
//     const code = `
// fetch('https://contentkit.co/api/v1/${projectId}', {
//   headers: {
//     Authorization: 'Bearer ' + ${user?.secret || ''},
//     Accept: 'application/json'
//   }
// })
//   .then(resp => resp.json())
//     `
    const code = `
  // Fires for every write on User
  const userIterator: AsyncIterator<User> = await prisma
    .$subscribe
    .user()
    .node();
  
  // Endless loop waiting for write-events
  while (true) {
    const result: IteratorResult<User> = await userIterator.next();
  }
  `
    return (
      <div className={classes.root}>
        <SyntaxHighlighter
          language={'typescript'}
          showLineNumbers
          codeTagProps={{
            style: {
              "fontFamily": "Roboto Mono, Consolas, Menlo, Monaco, \"Andale Mono WT\", \"Andale Mono\", \"Lucida Console\", \"Lucida Sans Typewriter\", \"DejaVu Sans Mono\", \"Bitstream Vera Sans Mono\", \"Liberation Mono\", \"Nimbus Mono L\", \"Courier New\", Courier, monospace",
              "fontSize": "14px",
              "lineHeight": "1.574",
              "direction": "ltr",
              "textAlign": "left",
              "whiteSpace": "pre",
              "wordSpacing": "normal",
              "wordBreak": "normal",
              "MozTabSize": "2",
              "OTabSize": "2",
              "tabSize": "2",
              "WebkitHyphens": "none",
              "MozHyphens": "none",
              "msHyphens": "none",
              "hyphens": "none",
              "background": "none",
              "color": "#24DA8D"
            }
          }}
          lineNumberContainerStyle={{
            color: "#8FA6B2",
            float: "left",
            opacity: 0.5,
            paddingRight: 20,
            textAlign: "right"
          }}
          style={style}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    )
  }
}

export default CodeSnippet
