import React from 'react'
import PropTypes from 'prop-types'
import { Select, FormControl, InputLabel, OutlinedInput } from '@material-ui/core'
import { useProjectsQuery } from '../../graphql/queries'

type SelectProjectProps = {
  onChange: (value: string) => void,
  className?: string,
  input?: any
}

function ProjectSelect (props: SelectProjectProps) {
  const [value, setValue] = React.useState('')
  const query = useProjectsQuery()
  const {
    onChange: onProjectChange
    ...rest
  } = props

  const onChange = ({ currentTarget: { value } }) => {
    setValue(value)
  }

  React.useEffect(() => {
    if (value) {
      onProjectChange(value)
    }
  }, [value])

  const options = (query?.data?.projects || []).concat([{ id: '', name: '' }])
  return (
    <Select
      native
      labelId='project-select'
      value={value}
      onChange={onChange}
      variant='outlined'
      {...rest}
    >
      {
        options.map(option => <option key={option.id} value={option.id}>{option.name}</option>)
      }
    </Select>
  )
}

ProjectSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
}

ProjectSelect.defaultProps = {
  input: (<OutlinedInput name='project' id='project' margin='dense' />)
}

export default ProjectSelect
