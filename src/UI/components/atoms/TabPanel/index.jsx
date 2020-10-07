// @flow
import React from 'react';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { fuseStyles } from 'UI/utils';
import { styles } from './styles';

type TabPanelProps = {
  children?: any,
  index: any,
  value: any,
  content?: 'start' | 'center'
};

const TabPanel = (props: TabPanelProps) => {
  const { children, value, content, index, ...other } = props;

  const startStyles = fuseStyles([styles.container, styles.contentStart]);

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          component="div"
          content={content}
          style={content === 'center' ? styles.container : startStyles}
        >
          {children}
        </Box>
      )}
    </Typography>
  );
};

TabPanel.defaultProps = {
  children: undefined,
  content: 'center'
};

export default TabPanel;
