// @flow
import React, { useState } from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { useStyles } from './styles';
import Contents from './strings';

type CustomRadioButtonOptionsProps = {
  defaultValue: string,
  radioTitle: string,
  controlValue: string,
  controlLabel: string,
  secondControlValue: string,
  secondControlLabel: string,
  customTextClassName: string,
  controlValueText: string,
  secondValueText: string
};

const CustomRadioButtonOptions = (props: CustomRadioButtonOptionsProps) => {
  const {
    defaultValue,
    radioTitle,
    controlValue,
    controlLabel,
    customTextClassName,
    secondControlValue,
    secondControlLabel,
    controlValueText,
    secondValueText
  } = props;
  const classes = useStyles(props);
  const language = localStorage.getItem('language');

  const [value, setValue] = useState(defaultValue);

  const handleChange = event => {
    setValue(event.target.value);
  };

  return (
    <FormControl component="fieldset">
      <RadioGroup
        aria-label={Contents[language]?.labelRadio}
        name="options"
        value={value}
        onChange={handleChange}
      >
        <div className={classes.optionsTitle}>{radioTitle}</div>
        <div className={classes.flexCenter}>
          <div className={classes.optionsContainer}>
            <div className={classes.radioDivider}>
              <FormControlLabel
                value={controlValue}
                control={<Radio color="primary" />}
                label={controlLabel}
              />
            </div>
            <FormControlLabel
              value={secondControlValue}
              control={<Radio color="primary" />}
              label={secondControlLabel}
            />
          </div>

          <div className={customTextClassName}>
            {value === controlValue ? controlValueText : secondValueText}
          </div>
        </div>
      </RadioGroup>
    </FormControl>
  );
};

CustomRadioButtonOptions.defaultProps = {
  customTextClassName: '',
  radioTitle: ''
};

export default CustomRadioButtonOptions;
