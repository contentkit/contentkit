import { makeStyles } from '@material-ui/styles'
import { MediaQueries } from '../../lib/media'

const styles = makeStyles((theme: any) => ({
  checkboxTableCell: {
    backgroundColor: '#fff',
    // backgroundColor: '#f4f4f4',
    borderBottom: '1px solid #e0e0e0'
  },
  tableHeadCell: {
    backgroundColor: '#fff',
    // backgroundColor: '#e0e0e0'
  },
  paper: {
    boxShadow: '0px 4px 8px rgba(60,45,111,0.1), 0px 1px 3px rgba(60,45,111,0.15)'
  },
  wrapper: {
    [MediaQueries.MOBILE]: {
      margin: '1em 0',
      boxShadow: theme.variables.shadow1,
      backgroundColor: '#fff',
      // backgroundColor: theme.variables.cardBackground
    },
    [theme.breakpoints.up('md')]: {
      margin: '1em 0',
      boxShadow: theme.variables.shadow1,
      backgroundColor: '#fff',
      // backgroundColor: theme.variables.cardBackground
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
