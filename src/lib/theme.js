import { createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
  typography: {
    fontFamily: '-apple-system,BlinkMacSystemFont,segoe ui,roboto,oxygen,ubuntu,cantarell,fira sans,droid sans,helvetica neue,sans-serif',
    useNextVariants: true,
    color: '#6d859e'
  },
  palette: {
    text: {
      primary: '#595959',
      secondary: '#bfbfbf',
      disabled: 'rgba(0, 0, 0, 0.38)',
      hint: 'rgba(0, 0, 0, 0.38)'
    },
    action: {
      selected: '#fafafa',
      hover: '#fafafa',
      active: '#f5f5f5'
    },
    primary: {
      light: '#85a5ff',
      main: '#2f54eb',
      dark: '#595959',
      contrastText: '#ffffff'
    },
    secondary: {
      light: '#e8e8e8',
      main: '#8c8c8c',
      dark: '#262626',
      contrastText: '#ffffff'
    },
    error: {
      light: '#ff85c0',
      main: '#eb2f96',
      dark: '#9e1068',
      contrastText: '#ffffff'
    }
  },
  overrides: {
    MuiPaper: {
      root: {
        boxShadow: 'rgba(8, 35, 51, 0.03) 0px 0px 2px, rgba(8, 35, 51, 0.05) 0px 3px 6px'
      }
    },
    MuiOutlinedInput: {
      root: {
        '& $notchedOutline': {
          borderColor: '#e8e8e8'
        },
        '&:hover:not($disabled):not($focused):not($error) $notchedOutline': {
          borderColor: '#d9d9d9'
        }
      },
      input: {
        // boxSizing: 'border-box',
        // padding: '8px 14px'
      }
    },
    MuiButton: {
      root: {
        textTransform: 'unset',
        fontWeight: '400'
      },
      raisedPrimary: {
        boxShadow: '0 1px 1px 0 rgba(109,133,158,0.5)',
        '&:hover': {
          boxShadow: '0 1px 1px 0 rgba(0,0,0,0.2)'
        }
      },
      raisedSecondary: {
        boxShadow: '0 1px 1px 0 rgba(216,224,234,0.5)',
        borderRadius: '5px',
        '&:hover': {
        }
      },
      containedPrimary: {
        backgroundColor: '#030852',
        backgroundImage: 'linear-gradient(160deg, #10239e 12.5%, #061178 85%)'
      },
      containedSecondary: {
        boxShadow: '0 1px 1px 0 rgba(216,224,234,0.5)',
        backgroundColor: '#f5f5f5',
        '&:hover': {
        }
      },
      outlinedPrimary: {
      }
    },
    MuiTable: {
      root: {
        border: '1px solid #f5f5f5'
      }
    },
    MuiTableCell: {
      root: {
        borderBottom: '1px solid #f5f5f5'
      },
      body: {
        color: '#595959'
      }
    },
    MuiTableRow: {
      root: {
        backgroundColor: '#fff',
        '&$selected': {
          backgroundColor: '#fafafa'
        },
        '&$hover': {
          backgroundColor: '#fafafa'
        }
      }
    },
    MuiCheckbox: {
      root: {
        color: '#597ef7',
        '&$checked': {
          color: '#2f54eb'
        }
      },
      colorSecondary: {
        color: '#597ef7',
        '&$checked': {
          color: '#2f54eb'
        }
      }
    },
    MuiTypography: {
      title: {
        color: '#595959'
      }
    },
    MuiDialogActions: {
      root: {
        padding: '10px 15px',
        borderTop: '1px solid #d8e0ea',
        margin: 0
      }
    },
    MuiDialog: {
      paper: {
        boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.14)',
        background: '#fff',
        borderRadius: '6px'
      }
    },
    MuiDialogTitle: {
      root: {
        backgroundColor: '#fafafa',
        borderBottom: '1px solid #e8e8e8',
        borderRadius: '6px 6px 0 0'
      }
    },
    MuiDialogContent: {
      root: {
        minWidth: '400px'
      }
    },
    MuiBackdrop: {
      root: {
        backgroundColor: 'rgba(76, 96, 114, 0.8)'
      }
    },
    MuiInput: {
      root: {
        borderRadius: '3px',
        // padding: '5px 5px 5px 13px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        fontSize: '16px',
        // boxSizing: 'border-box',
        '&$focused': {
        }
      },
      formControl: {},
      error: {
        color: '#d73a49',
        boxShadow: '0 0 0 1px #d73a49'
      }
    },
    MuiInputBase: {
      root: {
        '&$focused': {
        }
      }
    },
    MuiMenu: {
      paper: {
        boxShadow: '0 1px 1px 0 rgba(216,224,234,0.5)'
      }
    },
    MuiMenuItem: {
      root: {
        color: '#595959',
        backgroundColor: '#fff',
        '&:hover': {
          color: '#2f54eb',
          backgroundColor: '#fff'
        },
        '&$selected': {
        }
      }
    },
    MuiSelect: {
      root: {
        '&:focused': {
          background: 'transparent'
        }
      }
    },
    MuiChip: {
      root: {
        backgroundImage: 'linear-gradient(160deg, #f0f5ff 12.5%, #d6e4ff 85%)',
        color: '#030852'
      },
      deleteIcon: {
        color: '#597ef7'
      }
    },
    MuiIconButton: {
      root: {
        borderRadius: '0px',
        color: '#061178',
        boxShadow: 'none',
        backgroundColor: 'transparent',
        '&$disabled': {
          color: '#bcc1d9'
        },
        '&:hover': {
          color: '#364ba3',
        }
      }
    }
  }
})

export default theme
