// @flow
import React from 'react';
import NumberFormat from 'react-number-format';
import { nestTernary } from 'UI/utils/index';
import { TextField } from '@material-ui/core';
import { useStyles } from './styles';

// Custom Number Format Masks for phone, currency or any number (including phone extensions)
type NumberFormatCustomProps = {
  inputRef: any,
  onChange: any => any,
  type: Object,
  // inputType: 'currency' | 'phone' | 'number' | 'percentage',
  name: string
};
const NumberFormatCustom = (props: NumberFormatCustomProps) => {
  const {
    inputRef,
    onChange,
    type,
    type: { inputType },
    ...other
  } = props;
  return (
    <NumberFormat
      {...other}
      type={type}
      getInputRef={inputRef}
      onValueChange={values => {
        const { formattedValue, value } = values;
        onChange({
          target: {
            name: props.name,
            value,
            formattedValue
          }
        });
      }}
      thousandSeparator={inputType === 'currency' ? true : undefined}
      isNumericString={inputType === 'currency' ? true : undefined}
      format={inputType === 'phone' ? '(###)-###-####' : undefined}
      prefix={inputType === 'currency' ? '$' : undefined}
      suffix={inputType === 'percentage' ? '%' : undefined}
    />
  );
};

type TextBoxProps = {
  label: string, //
  onChange?: (name: string, value: any, formattedValue: any) => void, //
  required?: boolean,
  value?: ?string, //
  name: string, //
  disabled?: boolean,
  errorText?: string, //
  error?: boolean, //
  width?: string,
  minWidth?: any, //
  inputRef?: any, //
  multiline?: boolean,
  rows: number,
  display?: string,
  alignItems?: string,
  defaultValue: string,
  readOnly: boolean,
  outPutValue: boolean,
  inputType: 'currency' | 'phone' | 'number' | 'text' | 'percentage'
};

const TextBox = (props: TextBoxProps) => {
  const {
    label,
    error,
    errorText,
    onChange,
    required,
    value,
    name,
    width,
    disabled,
    minWidth,
    inputRef,
    multiline,
    rows,
    display,
    alignItems,
    defaultValue,
    readOnly,
    inputType,
    outPutValue,
    ...rest
  } = props;

  const additionalProps =
    value !== null
      ? {
          value
        }
      : nestTernary(defaultValue !== null, { defaultValue }, {});

  const handleChange = event => {
    const { value: text, formattedValue } = event.target;
    onChange && onChange(name, text, formattedValue);
  };

  const classes = useStyles(props);

  return (
    <TextField
      classes={classes}
      error={error}
      disabled={disabled || outPutValue}
      helperText={errorText}
      onChange={handleChange}
      required={required}
      name={name}
      label={label}
      placeholder={label}
      variant="outlined"
      inputRef={inputRef}
      {...additionalProps}
      autoComplete="new-password"
      multiline={multiline}
      rows={rows}
      InputProps={
        // this is only for numbers
        inputType === 'number' ||
        inputType === 'percentage' ||
        inputType === 'currency' ||
        inputType === 'phone'
          ? {
              readOnly,
              type: { type: 'number', inputType },
              inputComponent: NumberFormatCustom
            }
          : undefined
      }
      {...rest}
    />
  );
};

TextBox.defaultProps = {
  outPutValue: false,
  minWidth: 'unset',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  disabled: false,
  error: false,
  required: false,
  errorText: '',
  value: null,
  onChange: undefined,
  inputRef: undefined,
  multiline: false,
  rows: 5,
  defaultValue: '',
  readOnly: false,
  label: '',
  inputType: 'text'
};

export default TextBox;