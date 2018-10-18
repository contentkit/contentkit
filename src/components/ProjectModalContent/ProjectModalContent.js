// @flow
import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import WhitelistDomains from '../ProjectModalWhitelistDomains'
import ProjectIdInput from '../ProjectModalIdInput'
import ProjectModalForm from '../ProjectModalForm'
import ProjectModalToolbar from '../ProjectModalToolbar'

class ProjectModalContent extends React.Component<{
  handleDelete: () => void,
  handleSave: () => void,
  handleClose: () => void,
  onChange: () => void,
  classes: any,
  project: any
}, {}> {
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
      handleSave,
      classes
    } = this.props

    return (
      <div className='project-modal-content'>
        <div>
          <ProjectModalForm
            classes={this.props.classes}
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

        <ProjectModalToolbar
          classes={this.props.classes}
          handleDelete={handleDelete}
          handleSave={handleSave}
          handleClose={this.props.handleClose}
        />
      </div>
    )
  }
}

export default withStyles(
  theme => ({
    formControl: {
      width: '100%'
    },
    button: {
      margin: theme.spacing.unit
    },
    input: {}
  })
)(ProjectModalContent)
