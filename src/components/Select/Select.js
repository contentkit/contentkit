// @flow
import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import MuiSelect from '@material-ui/core/Select'
import Fade from '@material-ui/core/Fade'
import { OutlinedInput } from '@material-ui/core';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  formControl: {
    width: '100%'
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  },
  menuItem: {},
  select: {
    '&:focus': {
      background: 'transparent'
    }
  },
  label: {
    left: 5
  }
})

class Select extends React.Component {
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
        style={{ height: '40px' }}
        labelWidth={0}
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
        <FormControl className={classes.formControl}>
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
