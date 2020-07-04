import React from 'react'
import { CssBaseline } from '@material-ui/core'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider as MuiThemeProvider } from '@material-ui/styles'
import prismStyles from './prism'

const variables = {
  primaryColor: '#15bd76',
  secondaryColor: '#8fa6b2',
  colors: {
    default: '#40a9ff',
    success: '#15bd76',
    error: '#ff4f56',
    danger: '#ff4f56',
    info: '#40a9ff',
    warning: '#ffc53d'
  },
  fontFamily: 'Open Sans',
  textColor: '#1a202c',
  linkColor: '#3182ce',
  errorColor: '#ff4f56',
  borderColor: '#e2e8f0',
  backgroundColor: '#f7fafc',
  iconColor: '#bcc1d9',
  iconColorActive: '#2f54eb',
  iconColorHover: '#364ba3',
  cardBackground: '#ffffff',
  shadow1: 'rgba(8, 35, 51, 0.03) 0px 0px 2px, rgba(8, 35, 51, 0.05) 0px 3px 6px',
  darkBackgroundImage: 'linear-gradient(to bottom, #121212 0%, #323232 100%)',
  progressBackgroundImage: 'linear-gradient(160deg, #2F54EB 12.5%, #061178 85%)',
  selectedRowColor: 'rgba(240, 245, 255, 0.6)',
  $selecedRowHoverColor: '#f0f2f5',
  defaultRowHoverColor: '#fafafa'
}

const theme = createMuiTheme({
  palette: {
    primary: {
      main: variables.primaryColor
    },
    secondary: {
      main: variables.secondaryColor
    }
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(',')
  },
  // @ts-ignore
  variables: variables,
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '*:focus': {
          outline: 'none'
        },
        body: {
          '-webkit-font-smoothing': 'antialiased',
          lineHeight: 1.2,
          backgroundColor: 'rgb(247, 250, 252)'
        },
        '.DraftEditor-root': {
          height: 'inherit',
          textAlign: 'initial',
          position: 'relative',
          width: '100%',
          fontSize: 16,
          color: '#1a202c',
        },
        '.DraftEditor-root h1': {
          margin: '24px 0px 24px 30px'
        },
        '.DraftEditor-root h2': {
          margin: '24px 0px 24px 42px'
        },
        '.DraftEditor-root h3': {
          margin: '24px 0px 24px 48px'
        },
        '.DraftEditor-root h4': {
          margin: '24px 0px 24px 50px'
        },
        '.DraftEditor-root h1:before,.DraftEditor-root h2:before,.DraftEditor-root h3:before,.DraftEditor-root h4:before': {
          position: 'absolute',
          color: '#a0aec0',
          left: '0px'
        },
        '.DraftEditor-root h1:before': {
          content: '"#"'
        },
        '.DraftEditor-root h2:before': {
          content: '"##"'
        },
        '.DraftEditor-root h3:before': {
          content: '"###"'
        },
        '.DraftEditor-root h4:before': {
          content: '"####"'
        },
        '.DraftEditor-root ul': {
          listStyleType: 'none',
          padding: 0,
          margin: 0
        },
        '.DraftEditor-root ul li': {
          listStyle: 'none',
          paddingLeft: 20,
          textIndent: 0,
          fontFamily: 'Open Sans',
          fontStyle: 'normal',
          fontWeight: 400,
          fontSize: 16,
          lineHeight: '16px',
          display: 'block',
          '&:before': {
            content: '"\\2022"',
            color: '#a0aec0',
            fontWeight: 700,
            fontSize: 28,
            verticalAlign: 'middle',
            display: 'inline-block',
            transform: 'translate(-20px, 16px)'
          }
        },
        pre: {
          boxSizing: 'border-box',
          margin: '0 0 1em 0',
          padding: 20
        },
        blockquote: {
          padding: 16,
          backgroundColor: '#fafafa',
          borderLeft: '1px solid #f5f5f5',
          marginLeft: 20
        },
        'figure,img': {
          margin: 0
        },
        'code > .public-DraftStyleDefault-block': {
          paddingBottom: 0
        },
        img: {
          maxWidth: '100%',
          margin: '10px auto'
        },
        'a.link': {
          color: '#3182ce'
        },
        '.paragraph': {
          margin: '24px 0px',
          fontFamily: 'Open Sans',
          fontStyle: 'normal',
          fontWeight: 400,
          fontSize: 16,
          lineHeight: '24px'
        },
        figure: {
          margin: '0px 0px 12px 0px',
          padding: 0,
          maxWidth: '660px'
        },
        '.cke-code-container': {
          color: '#1a202c',
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
          overflow: 'auto',
          backgroundColor: '#f6f8fa',
          '& > pre': {
            margin: 0,
            padding: 0
          }
        },
        '.unfocused iframe': {
          pointerEvents: 'none'
        },
        '.unfocused:hover': {
          cursor: 'default',
          borderRadius: 2,
          boxShadow: '0 0 0 3px #D2E3F7'
        },
        '.focused': {
          cursor: 'default',
          borderRadius: 2,
          boxShadow: '0 0 0 3px #ACCEF7'
        },
        '.focused iframe': {
          pointerEvents: 'auto'
        },
        ...prismStyles
      }
    }
  }
})

export const ThemeProvider = props => (
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    {props.children}
  </MuiThemeProvider>
)
