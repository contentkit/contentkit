import background from './background'

export const styles = theme => ({
  container: {
    ...background,
    position: 'absolute',
    width: '100%'
  },
  login: {
    boxShadow: '0 15px 35px rgba(50,50,93,.1), 0 5px 15px rgba(0,0,0,.07)',
    borderRadius: '4px',
    padding: '5vh',
    backgroundColor: '#fff',
    maxWidth: '340px',
    margin: '25vh auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    maxWidth: '200px',
    margin: theme.spacing.unit
  },
  gutter: {
    marginBottom: '1em'
  }
})
