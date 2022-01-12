// @flow
import React, { useState } from 'react';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { useStyles, styles } from './styles';

type SwitcherProps = {
  textOn: string,
  textOff: string,
  onSwitcherChange?: any => any,
  isChecked: boolean
};

const Switcher = (props: SwitcherProps) => {
  const { textOn, textOff, onSwitcherChange, isChecked } = props;
  const [checked, setChecked] = useState(isChecked || false);
  const classes = useStyles();

  const handleChange = () => {
    setChecked(!checked);
    onSwitcherChange && onSwitcherChange(checked);
  };

  return (
    <div className={classes.root}>
      <Typography component="div">
        <Box
          style={styles.textContainer}
          className={!checked ? classes.selectedCategory : undefined}
        >
          {textOff}
        </Box>
      </Typography>
      <Switch
        checked={checked}
        onChange={handleChange}
        name="checked"
        color="primary"
      />
      <Typography component="div">
        <Box
          style={classes.textContainer}
          className={checked ? classes.selectedCategory : undefined}
        >
          {textOn}
        </Box>
      </Typography>
    </div>
  );
};

Switcher.defaultProps = {
  onSwitcherChange: undefined,
  textOn: 'On',
  textOff: 'Off'
};

export default Switcher;
