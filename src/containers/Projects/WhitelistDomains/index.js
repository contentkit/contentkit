// @flow
import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Chip from '@material-ui/core/Chip'
import Paper from '@material-ui/core/Paper'
import EnhancedInput from '../../../components/EnhancedInput'
import { project } from '../../../types/PropTypes'

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

class WhitelistDomains extends React.Component {
  state = {
    value: ''
  }

  static propTypes = {
    createDomain: PropTypes.func.isRequired,
    deleteDomain: PropTypes.func.isRequired,
    project: project
  }

  onDelete = (id) => {
    this.props.deleteDomain({
      id
    })
  }

  onChange = evt => {
    this.setState({ value: evt.target.value })
  }

  onKeyDown = (e) => {
    let projectId = this.props.project.data.Project.id
    let name = (' ' + this.state.value).slice(1)
    if (e.key === 'Enter') {
      this.setState({
        value: ''
      }, () => {
        this.props.createDomain({ name, projectId })
      })
    }
  }

  render () {
    const domains = this.props?.project?.data?.Project?.domains /* eslint-disable-line */
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
