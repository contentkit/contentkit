import React from 'react'
import PropTypes from 'prop-types'
import { TextField } from '@material-ui/core'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
  root: {
    color: '#fff',
    '&:hover $notchedOutline': {
      borderColor: '#fff'
    }
  },
  // input: {
  //   backgroundColor: '#f4f4f4',
  //   border: '2px solid #f4f4f4',
  //   '&:focus-within': {
  //     borderRadius: 0,
  //     border: '2px solid #0f62fe'
  //   }
  // }
  input: {
    '&::-webkit-calendar-picker-indicator': {
      display: 'block',
      width: '16px',
      height: '16px',
      borderWidth: 'thin',
      background: `no-repeat url('data:image/svg+xml;utf8,<svg aria-hidden="true" focusable="false" data-prefix="fal" data-icon="calendar-edit" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-calendar-edit fa-w-14 fa-2x"><path fill="white" d="M400 64h-48V12c0-6.6-5.4-12-12-12h-8c-6.6 0-12 5.4-12 12v52H128V12c0-6.6-5.4-12-12-12h-8c-6.6 0-12 5.4-12 12v52H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48zM48 96h352c8.8 0 16 7.2 16 16v48H32v-48c0-8.8 7.2-16 16-16zm352 384H48c-8.8 0-16-7.2-16-16V192h384v272c0 8.8-7.2 16-16 16zM255.7 269.7l34.6 34.6c2.1 2.1 2.1 5.4 0 7.4L159.1 442.9l-35.1 5c-6.9 1-12.9-4.9-11.9-11.9l5-35.1 131.2-131.2c2-2 5.4-2 7.4 0zm75.2 1.4l-19.2 19.2c-2.1 2.1-5.4 2.1-7.4 0l-34.6-34.6c-2.1-2.1-2.1-5.4 0-7.4l19.2-19.2c6.8-6.8 17.9-6.8 24.7 0l17.3 17.3c6.8 6.8 6.8 17.9 0 24.7z" class=""></path></svg>')`
    }
  },
  notchedOutline: {
    borderColor: '#fff'
  },
  formLabelRoot: {
    color: '#fff',
    '&$focused': {
      color: '#fff'
    }
  },
  focused: {}
}))

function PostMetaDatePicker (props) {
  const classes = useStyles(props)
  const { onChange, value } = props
  const ref = React.useRef(null)
  const onInputChange = (evt) => {
    const date = parse(evt.target.value, 'yyyy-MM-dd', new Date())
    onChange(date.toISOString())
  }

  React.useEffect(() => {
    if (ref.current) {
      ref.current.value = format(new Date(value), 'yyyy-MM-dd')
    }
  }, [])

  return (
    <TextField
      inputRef={ref}
      onChange={onInputChange}
      variant='outlined'
      margin='dense'
      type='date'
      fullWidth
      InputLabelProps={{
        shrink: true,
        classes: {
          root: classes.formLabelRoot,
          focused: classes.focused
        }
      }}
      InputProps={{
        classes: {
          input: classes.input,
          root: classes.root,
          notchedOutline: classes.notchedOutline
        }
      }}
    />
  )
}

PostMetaDatePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
}

export default PostMetaDatePicker
