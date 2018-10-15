// @flow
import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Chip from '@material-ui/core/Chip'
import Paper from '@material-ui/core/Paper'
import EnhancedInput from '../EnhancedInput'
import { projectQueryShape } from '../../shapes'
import type { ProjectQuery } from '../../types'

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: theme.spacing.unit / 2
  },
  chip: {
    margin: theme.spacing.unit / 2
  }
})

function WhitelistChips (props) {
  const { classes, domains } = props
  return (
    <Paper className={classes.root} elevation={0}>{
      domains.map(domain => <Chip
        key={domain.id}
        label={domain.name}
        onDelete={() => props.onDelete(domain.id)}
        className={classes.chip}
      />)
    }
    </Paper>
  )
}

WhitelistChips.propTypes = {
  classes: PropTypes.object.isRequired,
  domains: PropTypes.array
}

const WhitelistChipsWithStyles = withStyles(styles)(WhitelistChips)

class WhitelistDomains extends React.Component<{
  createOrigin: (data: any) => void,
  deleteOrigin: (data: any) => void,
  project: ProjectQuery
}, {
  value: string
}> {
  state = {
    value: ''
  }

  static propTypes = {
    creatOrigin: PropTypes.func.isRequired,
    deleteOrigin: PropTypes.func.isRequired,
    project: projectQueryShape
  }

  onDelete = (id) => {
    this.props.deleteOrigin({
      id
    })
  }

  onChange = evt => {
    this.setState({ value: evt.target.value })
  }

  onKeyDown = (e) => {
    let projectId = this.props.project.data.project.id
    let name = (' ' + this.state.value).slice(1)
    if (e.key === 'Enter') {
      this.setState({
        value: ''
      }, () => {
        this.props.createOrigin({ name, projectId })
      })
    }
  }

  render () {
    const { project } = this.props
    const domains = project && project.data && project.data.project.origins
    if (!domains) return false
    return (
      <div>
        <WhitelistChipsWithStyles
          domains={domains}
          onDelete={this.onDelete}
        />
        <EnhancedInput
          value={this.state.value}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
        />
      </div>
    )
  }
}

export default WhitelistDomains
