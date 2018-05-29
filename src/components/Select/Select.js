// @flow
import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import { default as MuiSelect } from '@material-ui/core/Select'

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  formControl: {
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  },
  menuItem: {
    backgroundColor: '#f4f9fd !important'
  },
  select: {
    '&:focus': {
      background: 'transparent'
    }
  }
})

declare interface option {
  value: string,
  label: string
}

declare interface props {
  label: string,
  value: string,
  onChange: () => void,
  classes: any,
  options: Array<option>
}

class Select extends React.Component<props> {
  static propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    classes: PropTypes.object,
    options: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string
    }))
  }

  static defaultProps = {
    label: 'Select',
    value: '',
    options: []
  }

  render () {
    const {
      classes,
      value,
      label,
      onChange,
      options
    } = this.props
    const id = label.replace(' ', '-').toLowerCase()
    return (
      <form className={classes.root} autoComplete='off'>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor={id}>{label}</InputLabel>
          <MuiSelect
            className={classes.select}
            value={value}
            onChange={onChange}
            input={
              <Input
                value={value}
                disableUnderline
                name={id}
                id={id}
              />
            }
          >
            {options.map((option, i) => (
              <MenuItem
                key={i}
                value={option.value}
                classes={{
                  selected: classes.menuItem
                }}
              >
                {option.label}
              </MenuItem>
            ))}
          </MuiSelect>
        </FormControl>
      </form>
    )
  }
}

export default withStyles(styles)(Select)
