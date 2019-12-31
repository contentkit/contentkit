import { makeStyles } from '@material-ui/styles'

const styles = makeStyles((theme: any) => ({
  checkboxTableCell: {
    backgroundColor: '#f4f4f4',
    borderBottom: '1px solid #e0e0e0'
  },
  tableHeadCell: {
    backgroundColor: '#e0e0e0'
  },
  wrapper: {
    [theme.breakpoints.up('md')]: {
      margin: '1em 0',
      boxShadow: theme.variables.shadow1,
      backgroundColor: theme.variables.cardBackground
    }
  },
  table: {
    fontFamily: theme.variables.fontFamily
  },
  toolbar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pagination: {
    justifyContent: 'flex-end'
  },
  selected: {},
  row: {}
}))

export default styles
