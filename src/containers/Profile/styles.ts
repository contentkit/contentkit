

import { makeStyles } from '@material-ui/styles'

export const useStyles = makeStyles(theme => ({
  userForm: {
    // @ts-ignore
    marginBottom: theme.spacing(2),
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 0,
    boxShadow: '0px 4px 8px rgba(60,45,111,0.1), 0px 1px 3px rgba(60,45,111,0.15)'
  },
  code: {
    margin: '2em auto 1em auto',
  },
  container: {
  },
  cards: {
    padding: 40
  }
}))

