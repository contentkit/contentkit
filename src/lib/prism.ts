export default {
  'code[class*=language-],pre[class*=language-],pre[class*=language-] code': {
    color: '#1a202c !important',
    fontFamily: 'Roboto Mono, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
    fontVariant: 'no-common-ligatures no-discretionary-ligatures no-historical-ligatures no-contextual',
    fontSize: 14,
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: 1.5,
    tabSize: 4,
    hyphens: 'none',
    borderRadius: 8,
    width: '100%',
    overflow: 'auto'
  },
  'pre[class*=language-]': {
    padding: '1em 0',
    margin: 0,
    overflow: 'auto'
  },
  ':not(pre) > code[class*=language-],pre[class*=language-]': {
	  background: '#f6f8fa !important'
  },
  ':not(pre) > code[class*=language-]': {
    padding: '.1em',
    borderRadius: '.3em',
    whiteSpace: 'normal'
  },
  'code.inline-code, inlinecode': {
	  display: 'inline',
    verticalAlign: 'baseline',
    padding: '.05em .3em .2em',
    background: '#f6f8fa',
    fontSize: '14px',
    fontFeatureSettings: '"clig" 0, "calt" 0',
    fontVariant: 'no-common-ligatures no-discretionary-ligatures no-historical-ligatures no-contextual',
    fontFamily: 'Roboto Mono',
    fontStyle: 'normal',
    lineHeight: '24px',
    borderRadius: '5px',
    color: '#1a202c',
    fontWeight: 500
  },
  inlinecode: {
    backgroundColor: '#e2e8f0'
  },
  '.top-section h1 inlinecode': {
    fontSize: '2rem'
  },
  '.token.cdata,.token.comment,.token.doctype,.token.prolog': {
    color: '#718096 !important',
    fontStyle: 'normal !important'
  },
  '.token.namespace': {
    opacity: '.7'
  },
  '.token.constant,.token.deleted,.token.number,.token.property,.token.symbol,.token.tag,.token.type-args': {
    color: '#dd6b21 !important'
  },
  '.token.attr-name,.token.builtin,.token.char,.token.inserted,.token.selector,.token.string': {
    color: '#690 !important'
  },
  '.language-css .token.string,.style .token.string,.token.entity,.token.operator,.token.url': {
    color: '#9a6e3a !important'
  },
  '.token.atrule,.token.attr-value,.token.keyword': {
    color: '#d5408c !important'
  },
  '.token.boolean,.token.class-name,.token.function,.token[class*=class-name]': {
    color: '#805ad5 !important'
  },
  '.token.important,.token.regex,.token.variable': {
    color: '#e90 !important'
  },
  '.token.bold,.token.important': {
    fontWeight: 700
  },
  '.token.italic': {
    fontStyle: 'italic'
  },
  '.token.entity': {
    cursor: 'help'
  },
  '.token.annotation': {
    color: '#319795 !important'
  }
}