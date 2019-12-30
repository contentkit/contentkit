import React from 'react'
import PropTypes from 'prop-types'
import WhitelistDomains from '../ProjectModalWhitelistDomains'
import ProjectIdInput from '../ProjectModalIdInput'
import ProjectModalForm from '../ProjectModalForm'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
  formControl: {
    width: '100%',
    marginBottom: 15
  },
  button: {},
  input: {
    marginBottom: 15
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%'
  }
}))

function ProjectModalContent (props) {
  const classes = useStyles(props)
  const ref = React.useRef()

  function setRef (instance) {
    ref.current = ref
  }

  const onCopy = () => {
    ref.current.select()
    document.execCommand('copy')
  }

  const {
    project,
    handleDelete,
    handleSave
  } = props

  if (!project?.data) return null
  return (
    <div className={classes.content}>
      <ProjectModalForm
        classes={classes}
        project={project?.data?.projects[0]} /* eslint-disable-line */
        onChange={props.onChange}
      />
      <ProjectIdInput
        value={project?.data?.projects[0]?.id} /* eslint-disable-line */
        setRef={setRef}
        onCopy={onCopy}
        classes={classes}
      />
      <WhitelistDomains
        deleteOrigin={props.deleteOrigin}
        createOrigin={props.createOrigin}
        project={props.project}
        users={props.users}
      />
    </div>
  )
}

ProjectModalContent.propTypes = {
  handleDelete: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
}

export default ProjectModalContent

