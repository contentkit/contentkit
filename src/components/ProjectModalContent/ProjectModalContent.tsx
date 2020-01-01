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
  const projectIdRef = React.useRef()

  const onCopy = () => {
    // @ts-ignore
    projectIdRef.current.select()
    document.execCommand('copy')
  }

  const {
    project,
    users,
    onChange
  } = props

  if (!project?.data) return null
  return (
    <div className={classes.content}>
      <ProjectModalForm
        classes={classes}
        project={project?.data?.projects[0]}
        onChange={onChange}
      />
      <ProjectIdInput
        value={project?.data?.projects[0]?.id}
        ref={projectIdRef}
        onCopy={onCopy}
      />
      <WhitelistDomains
        deleteOrigin={props.deleteOrigin}
        createOrigin={props.createOrigin}
        project={project}
        users={users}
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

