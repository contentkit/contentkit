import React from 'react'
import PropTypes from 'prop-types'
import { InputBase } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { useDebounce } from 'react-use'

type SearchInputProps = {
  classes?: { [key: string]: string },
  onSearch: ({ value: string }) => void,
  placeholder?: string,
  setSearchLoading: (loading: boolean) => void
}

const useStyles = makeStyles(theme => ({
  root: {
    padding: 8,
    background: 'transparent',
    fontSize: 12
  }
}))

function SearchInput (props: SearchInputProps) {
  const classes = useStyles(props)
  const [value, setValue] = React.useState('')
  const {
    onSearch,
    setSearchLoading,
    ...rest
  } = props

  const ref = React.useRef(false)

  function onKeyDown (evt) {
    if (evt.which === 13) {
      onSearch({ value })
    }
  }

  const onChange = evt => {
    setValue(evt.target.value)
  }

  useDebounce(() => {
    onSearch({ value })
    ref.current = false
  }, 500, [value])


  React.useEffect(() => {
    if (value && !ref.current) {
      ref.current = true
      setSearchLoading(true)
    }
  }, [value])

  return (
    <InputBase
      onChange={onChange}
      value={value}
      onKeyDown={onKeyDown}
      classes={{
        root: classes.root
      }}
      {...rest}
    />
  )
}

SearchInput.propTypes = {
  onSearch: PropTypes.func.isRequired,
  value: PropTypes.string
}

export default SearchInput
