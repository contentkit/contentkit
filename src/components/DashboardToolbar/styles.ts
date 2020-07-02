import { makeStyles } from '@material-ui/styles'

export const useStyles = makeStyles((theme: any) => ({
  input: {
    
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexBasis: '45%'
  },
  select: {
    fontSize: 12
  },
  root: {
    width: '100%',
    backgroundColor: '#f7fafc',
    display: 'flex',
    flexDirection: 'column',
    borderBottom: '1px solid #e2e8f0'
  },
  flex: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  toolbar: {
    display: 'flex',
    '& > div': {
      flexBasis: '50%'
    }
  },
  button: {
    borderRadius: 0,
    color: '#000'
  },
  newPostButton: {
    height: 48,
    borderRadius: 0
  },
  active: {
    color: theme.variables.iconColorActive,
    '&:hover': {
      color: theme.variables.iconColorHover,
      cursor: 'pointer'
    }
  }
}))
