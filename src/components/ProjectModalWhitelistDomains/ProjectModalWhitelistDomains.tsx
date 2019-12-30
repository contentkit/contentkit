import React from 'react'
import PropTypes from 'prop-types'
import { projectQueryShape } from '../../shapes'
import { Chip, Input } from '@contentkit/components'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginBottom: 15
  },
  chip: {}
})

type WhitelistChipsProps = {
  domains: {
    id: string,
    name: string
  }[],
  onDelete: (id: string) => void
}

function WhitelistChips (props: WhitelistChipsProps) {
  const classes = useStyles(props)
  const { domains, onDelete } = props
  return (
    <div className={classes.root}>
      {
        domains.map(domain =>
          <Chip
            key={domain.id}
            onDelete={() => onDelete(domain.id)}
            className={classes.chip}
            color='primary'
            closable
            label={domain.name}
            variant='outlined'
          />
        )
      }
    </div>
  )
}

WhitelistChips.propTypes = {
  domains: PropTypes.array
}

type WhitelistDomainsProps = {
  deleteOrigin: {
    mutate: ({ id: string }) => void
  },
  createOrigin: {
    mutate: ({ name: string, projectId: string, userId: string }) => void
  },
  project: any,
  users: any
}

function WhitelistDomains (props: WhitelistDomainsProps) {
  const [value, setValue] = React.useState('')

  const {
    deleteOrigin,
    createOrigin,
    project
  } = props
  const onDelete = (id) => {
    deleteOrigin.mutate({ id })
  }

  const onChange = evt => {
    setValue(evt.target.value)
  }

  const onKeyDown = (e) => {
    const projectId = props.project.data.projects[0].id
    const name = (' ' + value).slice(1)
    const userId = props.users.data.users[0].id
    if (e.key === 'Enter') {
      setValue('')
      createOrigin.mutate({ name, projectId, userId })
    }
  }

  const { project } = props
  const domains = project?.data?.projects[0]?.origins || []
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
