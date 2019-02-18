import { createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
  typography: {
    fontFamily: 'Open Sans',
    useNextVariants: true,
    color: '#6d859e'
  },
  palette: {
    primary: {
      '50': '#6cb8ff',
      '100': '#6cb8ff',
      '200': '#6cb8ff',
      '300': '#4ba8ff',
      '400': '#4ba8ff',
      '500': '#4ba8ff',
      // "500": "#3b99f0",
      '600': '#3b99f0',
      '700': '#3391e9',
      '800': '#3391e9',
      '900': '#2687e3',
      'A100': '#2687e3',
      'A200': '#2687e3',
      'A400': '#2687e3',
      'A700': '#2687e3'
    },
    secondary: {
      '50': '#f4f9fd',
      '100': '#ecf3f8',
      '150': '#e5eef4',
      '200': '#d8e0ea',
      '300': '#bdc9d6',
      '400': '#bdc9d6',
      '500': '#9bacbf',
      '600': '#9bacbf',
      '700': '#6d859e',
      '800': '#6d859e',
      '900': '#4c6072',
      'A100': '#4c6072',
      'A200': '#4c6072',
      'A400': '#4c6072',
      'A700': '#4c6072'
    }
    // error: {
    //  "300": "#e4567b"
    // }
  },
  overrides: {
    MuiButton: {
      raisedPrimary: {
        backgroundImage: 'linear-gradient(0deg, #4ba8ff 0, #6cb8ff 100%)',
        color: '#fff',
        border: '1px solid #2687e3',
        borderRadius: '5px',
        boxShadow: '0 1px 1px 0 rgba(109,133,158,0.5)',
        '&:hover': {
          boxShadow: '0 1px 1px 0 rgba(0,0,0,0.2)'
        }
      },
      raisedSecondary: {
        boxShadow: '0 1px 1px 0 rgba(216,224,234,0.5)',
        color: '#6d859e',
        border: '1px solid #d8e0ea',
        borderRadius: '5px',
        backgroundImage: 'linear-gradient(0deg, #ecf3f8 0, #fff 100%)',
        '&:hover': {
          backgroundImage: 'linear-gradient(0deg, #fff 0, #fff 100%)'
        }
      },
      flatSecondary: {
        boxShadow: '0 1px 1px 0 rgba(216,224,234,0.5)',
        color: '#6d859e',
        '&:hover': {
          color: '#4ba8ff'
        }
      }
    },
    MuiTableCell: {
      root: {
        borderBottom: '1px solid #f4f9fd'
      },
      body: {
        color: '#6d859e'
      }
    },
    MuiTableRow: {
      root: {
        backgroundColor: '#fff',
        '&$selected': {
          backgroundColor: '#f4f9fd'
        },
        '&$hover': {
          backgroundColor: '#f4f9fd'
        }
      }
    },
    MuiCheckbox: {
      root: {
        '&$checked': {
          color: '#4ba8ff'
        }
      }
      // checkedSecondary: {
      //  color: '#4ba8ff'
      // },
      // default: {
      //  color: '#d8e0ea'
      // }
    },
    MuiTypography: {
      title: {
        color: '#6d859e'
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
        // border: '1px solid #ecf3f8',
        background: '#fff',
        borderRadius: '6px'
      }
    },
    MuiDialogTitle: {
      root: {
        backgroundColor: '#4ba8ff',
        color: '#fff',
        borderBottom: '1px solid #3b99f0',
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
        // padding: 0,
        border: '1px solid #d8e0ea',
        borderRadius: '5px',
        color: '#4c6072',
        fontSize: '17px',
        '&$focused': {
          border: '1px solid #3391e9'
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
        color: '#6d859e',
        backgroundColor: '#fff',
        '&:hover': {
          color: '#4ba8ff',
          backgroundColor: '#fff'
        },
        '&$selected': {
          backgroundColor: '#f4f9fd'
        }
      }
    },
    MuiSelect: {
      root: {
        // paddingLeft: '12px'
      },
      select: {
        '&:focus': {
          background: 'transparent'
        }
      }
    },
    MuiChip: {
      root: {
        backgroundColor: '#6d859e',
        color: '#fff'
      },
      deleteIcon: {
        color: '#bdc9d6'
      }
    },
    MuiIconButton: {
      root: {
        color: '#fff',
        '&:hover': {
          color: '#FFD209'
        },
        '&$disabled': {
          color: '#6cb8ff'
        }
      }
    }
  }
})

export default theme
