// @flow
import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import WhitelistDomains from '../WhitelistDomains'
import ProjectIdInput from '../ProjectIdInput'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Button from '@material-ui/core/Button'
import Toolbar from '@material-ui/core/Toolbar'

const ProjectModalToolbar = ({
  classes,
  handleSave,
  handleDelete,
  handleClose
}) => (
  <Toolbar disableGutters style={{justifyContent: 'space-between'}}>
    <Button
      className={classes.button}
      variant='flat'
      color='secondary'
      onClick={handleDelete}>
        Delete
    </Button>
    <div>
      <Button
        className={classes.button}
        variant='raised'
        color='secondary'
        onClick={() => handleClose()}>
          Close
      </Button>
      <Button
        variant='raised'
        color='primary'
        onClick={handleSave}>
          Save
      </Button>
    </div>
  </Toolbar>
)

const ProjectModalForm = ({ classes, Project, onChange }) => (
  <FormControl
    margin='normal'
    className={classes.formControl}
  >
    <InputLabel htmlFor='project-name'>Project Name</InputLabel>
    <Input
      className={classes.input}
      disableUnderline
      id='project-name'
      value={Project.name}
      onChange={evt =>
        onChange({ name: evt.target.value })
      }
    />
  </FormControl>
)

class ProjectModalContent extends React.Component {
  static propTypes = {
    handleDelete: PropTypes.func.isRequired,
    handleSave: PropTypes.func.isRequired,
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
            Project={project?.data?.Project} /* eslint-disable-line */
            onChange={this.props.onChange}
          />
          <ProjectIdInput
            value={project?.data?.Project?.id} /* eslint-disable-line */
            setRef={(ref) => { this.ref = ref }}
            onCopy={this.onCopy}
            classes={classes}
          />
          <WhitelistDomains
            {...this.props}
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
