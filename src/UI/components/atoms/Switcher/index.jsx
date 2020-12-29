// @flow
import React, { useState } from 'react';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { useStyles, styles } from './styles';

type SwitcherProps = {
  category: 'candidates' | 'job orders' | 'companies',
  onSwitcherChange?: any => any
};

const Switcher = (props: SwitcherProps) => {
  const { category, onSwitcherChange } = props;
  const [checked, setChecked] = useState(true);
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
          My {category}
        </Box>
      </Typography>
      <Switch checked={checked} onChange={handleChange} name="checked" color="primary" />
      <Typography component="div">
        <Box
          style={classes.textContainer}
          className={checked ? classes.selectedCategory : undefined}
        >
          My Industries {category}
        </Box>
      </Typography>
    </div>
  );
};

Switcher.defaultProps = {
  onSwitcherChange: undefined
};

export default Switcher;
