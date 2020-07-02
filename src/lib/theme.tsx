import React from 'react'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider as MuiThemeProvider } from '@material-ui/styles'

// @primary-color: @blue-6;
// @info-color: @blue-6;
// @success-color: @green-6;
// @processing-color: @blue-6;
// @error-color: @red-6;
// @highlight-color: @red-6;
// @warning-color: @gold-6;
// @normal-color: #d9d9d9;
// @white: #fff;
// @black: #000;

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
  variables: variables
})

export const ThemeProvider = props => (
  <MuiThemeProvider theme={theme}>
    {props.children}
  </MuiThemeProvider>
)
