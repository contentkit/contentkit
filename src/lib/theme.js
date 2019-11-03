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
  primaryColor: '#2f54eb',
  secondaryColor: '#2f54eb',
  colors: {
    default: '#40a9ff',
    success: '#73d13d',
    error: '#ff4d4f',
    danger: '#ff4d4f',
    info: '#40a9ff',
    warning: '#ffc53d'
  },
  fontFamily: 'IBM Plex Sans',
  // fontFamily: '-apple-system,BlinkMacSystemFont,segoe ui,roboto,oxygen,ubuntu,cantarell,fira sans,droid sans,helvetica neue,sans-serif',
  textColor: '#595959',
  errorColor: '#e4567b',
  borderColor: '#f5f5f5',
  backgroundColor: '#f0f5ff',
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
      'IBM Plex Sans',
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
  variables: variables
})

export const ThemeProvider = props => (
  <MuiThemeProvider theme={theme}>
    {props.children}
  </MuiThemeProvider>
)
