// @flow
import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import { default as MuiSelect } from '@material-ui/core/Select'
import Fade from '@material-ui/core/Fade'
import FilledInput from '@material-ui/core/FilledInput'
import { OutlinedInput } from '@material-ui/core';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  formControl: {
    // minWidth: 120,
    width: '100%',
    height: 48
    // margin: 'dense'
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
  },
  label: {
    left: 5
  }
})

type Option = {
  value: string,
  label: string
}

type Props = {
  label: string,
  value: string,
  onChange: () => void,
  classes: any,
  options: Array<Option>
}

class Select extends React.Component<Props> {
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

  renderInput = () => {
    const {
      value,
      label
    } = this.props
    const id = label.replace(' ', '-').toLowerCase()
    return (
      <OutlinedInput
        value={value}
        name={id}
        id={id}
        style={{ height: 48 }}
      />
    )
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
        <FormControl className={classes.formControl} variant='filled'>
          {/*<InputLabel htmlFor={id} className={classes.label}>{label}</InputLabel>*/}
          <MuiSelect
            className={classes.select}
            value={value}
            onChange={onChange}
            MenuProps={{
              TransitionComponent: Fade
            }}
            input={this.renderInput()}
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
