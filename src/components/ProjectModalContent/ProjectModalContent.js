import React from 'react'
import PropTypes from 'prop-types'
import WhitelistDomains from '../ProjectModalWhitelistDomains'
import ProjectIdInput from '../ProjectModalIdInput'
import ProjectModalForm from '../ProjectModalForm'
import ProjectModalToolbar from '../ProjectModalToolbar'
import classes from './styles.scss'

class ProjectModalContent extends React.Component {
  static propTypes = {
    handleDelete: PropTypes.func.isRequired,
    handleSave: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  }

  onCopy = () => {
    this.ref.select()
    document.execCommand('copy')
  }

  render () {
    const {
      project,
      handleDelete,
      handleSave
    } = this.props

    return (
      <div className={classes.content}>
        <ProjectModalForm
          classes={classes}
          Project={project.data && project.data.project} /* eslint-disable-line */
          onChange={this.props.onChange}
        />
        <ProjectIdInput
          value={project.data && project.data.project.id} /* eslint-disable-line */
          setRef={
            (ref) => { this.ref = ref }
          }
          onCopy={this.onCopy}
          classes={classes}
        />
        <WhitelistDomains
          deleteOrigin={this.props.deleteOrigin}
          createOrigin={this.props.createOrigin}
          project={this.props.project}
        />
      </div>
    )
  }
}

export default ProjectModalContent

