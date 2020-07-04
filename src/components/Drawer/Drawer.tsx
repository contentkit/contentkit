import { makeStyles } from '@material-ui/styles'
import ReactDOM from 'react-dom'
import React, { ReactNode } from 'react'
import { Slide, Paper, Theme } from '@material-ui/core'
import PostEditorMedaModal from '../PostEditorMetaModal'

type PortalProps = {
  children: ReactNode
}

class Portal extends React.Component<PortalProps> {
  el: HTMLElement
  root: HTMLElement

  constructor(props: PortalProps) {
    super(props)
    this.el = document.createElement('div')
    this.root = document.getElementById('root')
  }

  componentDidMount() {
    document.body.insertBefore(this.el, this.root)
  }

  componentWillUnmount() {
    document.body.removeChild(this.el)
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this.el
    )
  }
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: 'fixed',
    top: 0,
    left: 60,
    bottom: 0,
    width: 400,
    backgroundColor: '#2D3748',
    opacity: 0.85,
    zIndex: theme.zIndex.appBar
  },
  inner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxSizing: 'border-box',
    // @ts-ignore
    padding: theme.spacing(3),
    justifyContent: 'space-between',
    height: '100%'
  }
}))

type CustomSwipeableDrawerProps = {
  open: boolean
  onClose: () => void
}

function Drawer (props: any) {
  const { open } = props
  const classes = useStyles(props)
  return (
    <Slide in={open} unmountOnExit mountOnEnter direction='right'>
      <Paper className={classes.root} elevation={1} square>
        <div className={classes.inner}>
          <PostEditorMedaModal {...props} />
        </div>
      </Paper>
    </Slide>
  )
}

export default Drawer