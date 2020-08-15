import { makeStyles } from '@material-ui/styles'

export const useStyles = makeStyles((theme: any) => ({
  container: {
    margin: '2em auto 1em auto',
    padding: 40,
    maxWidth: 960,
    backgroundColor: '#fff',
    borderRadius: 0,
    boxShadow: theme.variables.shadow1
  },
  gutter: {
    marginBottom: theme.spacing(2)
  },
  flex: {
    display: 'flex',
    marginLeft: -10,
    marginRight: -10,
    justifyContent: 'flex-end'
  },
  button: {
    margin: 10,
    color: '#fff'
  }
}))
