export const styles = theme => ({
  wrapper: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    top: `${50}%`,
    left: `${50}%`,
    transform: `translate(-${50}%, -${50}%)`,
    height: '400px',
    width: '500px',
    '&:focus': {
      'outline': 'none'
    }
  },
  modal: {
    '&:focus': {
      'outline': 'none'
    }
  }
})
