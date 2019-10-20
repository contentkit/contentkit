import React from 'react'
import PropTypes from 'prop-types'
import WhitelistDomains from '../ProjectModalWhitelistDomains'
import ProjectIdInput from '../ProjectModalIdInput'
import ProjectModalForm from '../ProjectModalForm'
import classes from './styles.scss'

function ProjectModalContent (props) {
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
        project={project?.data?.project} /* eslint-disable-line */
        onChange={props.onChange}
      />
      <ProjectIdInput
        value={project?.data?.project.id} /* eslint-disable-line */
        setRef={setRef}
        onCopy={onCopy}
        classes={classes}
      />
      <WhitelistDomains
        deleteOrigin={props.deleteOrigin}
        createOrigin={props.createOrigin}
        project={props.project}
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

