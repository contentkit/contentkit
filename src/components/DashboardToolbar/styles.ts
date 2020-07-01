import { makeStyles } from '@material-ui/styles'

export const useStyles = makeStyles((theme: any) => ({
  input: {},
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexBasis: '45%'
  },
  select: {
    width: '100%',
    marginRight: 15
  },
  root: {
    width: '100%',
    backgroundColor: '#f4f4f4',
    display: 'flex',
    flexDirection: 'column'
  },
  flex: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#f4f4f4'
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
    height: 42
  },
  active: {
    color: theme.variables.iconColorActive,
    '&:hover': {
      color: theme.variables.iconColorHover,
      cursor: 'pointer'
    }
  }
}))
