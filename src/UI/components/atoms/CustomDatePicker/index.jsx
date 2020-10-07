// @flow
import React from 'react';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import CustomIconButton from 'UI/components/atoms/CustomIconButton';

import { InputAdornment } from '@material-ui/core';
import { Clear as ClearIcon, InsertInvitation as CalendarIcon } from '@material-ui/icons';
import { DatePicker, DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

import { useStyles } from './styles';

type CustomDatePickerProps = {
  label?: string,
  name: string,
  customStyle?: Object,
  withTime?: boolean,
  value: any,
  onDateChange: (string, any) => any,
  disabled: boolean
};

const CustomDatePicker = (props: CustomDatePickerProps) => {
  moment.locale('en');

  const { label, name, customStyle, withTime, value, onDateChange, disabled, ...rest } = props;
  const classes = useStyles();

  const onDateClear = e => {
    e.stopPropagation();
    onDateChange(name, null);
  };

  const onChange = date => {
    onDateChange(name, date);
  };

  const pickerProps = {
    variant: 'inline',
    inputVariant: 'outlined',
    autoOk: true,
    clearable: 'true',
    ampm: true,
    value,
    classes,
    style: { ...customStyle },
    label,
    onChange,
    allowKeyboardControl: true
  };

  const Picker = withTime ? DateTimePicker : DatePicker;
  return (
    <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
      <Picker
        {...pickerProps}
        format={withTime ? 'MMMM DD, hh:mm a' : 'MMMM DD, yyyy'} // default
        disabled={disabled}
        {...rest}
        InputProps={{
          endAdornment: value ? (
            <>
              <InputAdornment position="end">
                <CustomIconButton disabled={disabled} onClick={onDateClear}>
                  <ClearIcon />
                </CustomIconButton>
              </InputAdornment>
            </>
          ) : (
            <InputAdornment position="end">
              <CustomIconButton disabled={disabled}>
                <CalendarIcon />
              </CustomIconButton>
            </InputAdornment>
          )
        }}
      />
    </MuiPickersUtilsProvider>
  );
};

CustomDatePicker.defaultProps = {
  customStyle: {},
  label: 'Looking since *',
  withTime: false
};

export default CustomDatePicker;
