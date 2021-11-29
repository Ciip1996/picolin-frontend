// @flow
import React, { useState } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { useStyles, useGlobalSelectSyles, useOtherClasses } from './styles';

type SelectBoxProps = {
  error?: boolean,
  options: Array<any>,
  placeholder?: string,
  displayKey?: string,
  showFirstOption?: boolean,
  onSelect?: (name?: string, value: any) => void,
  name?: string,
  isGlobal: boolean,
  selected: Object,
  rest: any
};

const SelectBox = (props: SelectBoxProps) => {
  const {
    error,
    options,
    placeholder,
    displayKey,
    showFirstOption,
    onSelect,
    name,
    isGlobal,
    selected,
    rest
  } = props;
  const selectClasses = useStyles();
  const globalSelectClasses = useGlobalSelectSyles();
  const classes = useOtherClasses({ isGlobal });

  const [selectedValue, setSelectedValue] = useState(
    selected ||
      ((isGlobal || showFirstOption) && options && options.length
        ? options[0]
        : null)
  );

  const handleChange = event => {
    const { value } = event.target;
    setSelectedValue(value);
    onSelect && onSelect(name, value);
  };

  return (
    <FormControl style={{ width: '100%' }} variant="outlined" error={error}>
      {!isGlobal && (
        <InputLabel
          htmlFor="outlined-select-native-simple"
          className={classes.label}
        >
          {placeholder}
        </InputLabel>
      )}
      <Select
        labelWidth={isGlobal ? 0 : undefined}
        value={selectedValue}
        onChange={handleChange}
        classes={isGlobal ? globalSelectClasses : selectClasses}
        className={isGlobal ? classes.selectGlobal : classes.select}
        label={isGlobal ? undefined : placeholder}
        {...rest}
      >
        {options.map(option => (
          <MenuItem
            className={classes.selectMenu}
            key={Math.random()}
            value={option}
          >
            {displayKey ? option[displayKey] : option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

SelectBox.defaultProps = {
  error: false,
  placeholder: '',
  isGlobal: false,
  displayKey: undefined,
  showFirstOption: false,
  onSelect: undefined,
  name: 'select-box',
  rest: {},
  selected: undefined
};

export default SelectBox;
