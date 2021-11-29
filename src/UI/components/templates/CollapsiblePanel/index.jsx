// @flow
import * as React from 'react';

import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';

import { styles } from './styles';
import './styles.css';

type CollapsiblePanelProps = {
  isSideMenuOpen: boolean,
  mode: 'overlay' | 'inline',
  onToggle: any => any,
  children: React.Node
};

const CollapsiblePanel = (props: CollapsiblePanelProps) => {
  const { isSideMenuOpen, onToggle, mode = 'overlay', children } = props;

  const sideMenuStyles = {
    ...styles[`${mode}Container`],
    ...(isSideMenuOpen
      ? styles[[`${mode}ContainerOpened`]]
      : styles[`${mode}ContainerClosed`])
  };

  return (
    <Paper elevation={1} style={sideMenuStyles}>
      {children}
      <Box onClick={onToggle} style={styles.togglerButton}>
        <div className={`collapser ${isSideMenuOpen ? 'is-active' : ''}`}>
          <div className="collapser-box">
            <div className="collapser-inner" />
          </div>
        </div>
      </Box>
    </Paper>
  );
};

export default CollapsiblePanel;
