import React from 'react'
import PropTypes from 'prop-types'
import Tag from 'antd/lib/tag'
import { projectQueryShape } from '../../shapes'
import classes from './styles.scss'
import Input from 'antd/lib/input'

function WhitelistChips (props) {
  const { domains } = props
  return (
    <div className={classes.root}>
      {
        domains.map(domain =>
          <Tag
            key={domain.id}
            onClose={() => props.onDelete(domain.id)}
            className={classes.chip}
            color={'magenta'}
            closable
          >
            {domain.name}
          </Tag>
        )
      }
    </div>
  )
}

WhitelistChips.propTypes = {
  classes: PropTypes.object.isRequired,
  domains: PropTypes.array
}

class WhitelistDomains extends React.Component {
  state = {
    value: ''
  }

  static propTypes = {
    createOrigin: PropTypes.func.isRequired,
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
    const domains = project?.data?.project?.origins || []
    return (
      <div>
        <WhitelistChips
          domains={domains}
          onDelete={this.onDelete}
        />
        <Input
          value={this.state.value}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
        />
      </div>
    )
  }
}

export default WhitelistDomains
