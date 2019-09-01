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
  domains: PropTypes.array
}

function WhitelistDomains (props) {
  const [value, setValue] = React.useState('')

  const onDelete = (id) => {
    props.deleteOrigin({ id })
  }

  const onChange = evt => {
    setValue(evt.target.value)
  }

  const onKeyDown = (e) => {
    const projectId = props.project.data.project.id
    const name = (' ' + value).slice(1)
    if (e.key === 'Enter') {
      setValue('', () => {
        props.createOrigin({ name, projectId })
      })
    }
  }

  const { project } = props
  const domains = project?.data?.project?.origins || []
  return (
    <div>
      <WhitelistChips
        domains={domains}
        onDelete={onDelete}
      />
      <Input
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    </div>
  )
}

WhitelistDomains.propTypes = {
  createOrigin: PropTypes.func.isRequired,
  deleteOrigin: PropTypes.func.isRequired,
  project: projectQueryShape
}

export default WhitelistDomains
