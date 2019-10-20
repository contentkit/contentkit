import React from 'react'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider as MuiThemeProvider } from '@material-ui/styles'

const theme = createMuiTheme({
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
  variables: {
    fontFamily: '-apple-system,BlinkMacSystemFont,segoe ui,roboto,oxygen,ubuntu,cantarell,fira sans,droid sans,helvetica neue,sans-serif',
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
})

export const ThemeProvider = props => (
  <MuiThemeProvider theme={theme}>
    {props.children}
  </MuiThemeProvider>
)
