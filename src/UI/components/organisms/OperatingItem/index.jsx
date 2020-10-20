// @flow
import React, { useState } from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import Box from '@material-ui/core/Box';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';

import { formatMetricPeriod } from 'UI/utils';
import { EntityType } from 'UI/constants/entityTypes';
import { CandidatesIcon, JobOrdersIcon, Operating10Icon, colors } from 'UI/components/molecules/ProductCard/node_modules/UI/res';
import Text from 'UI/components/molecules/ProductCard/node_modules/UI/components/atoms/Text';

import OperatingProgress from '../../molecules/OperatingProgress';

import OperatingChecklist from '../OperatingChecklist';

import { styles, useItemStyles } from './styles';

type OperatingItemProps = {
  item: any,
  type: 'candidate' | 'joborder',
  onProfileClick: number => any
};

const OperatingItem = (props: OperatingItemProps) => {
  const itemClasses = useItemStyles();
  const { item, type, onProfileClick } = props;
  const [uiState, setUiState] = useState({
    isExpanded: false
  });

  const handleToggle = () => {
    setUiState(prevState => ({ ...prevState, isExpanded: !prevState.isExpanded }));
  };

  const handleProfileClick = () => {
    onProfileClick && onProfileClick(item.id);
  };
  const period = formatMetricPeriod(item);

  return (
    <>
      <ListItem
        button
        divider={!uiState.isExpanded}
        selected={uiState.isExpanded}
        onClick={handleToggle}
        classes={itemClasses}
      >
        <Box style={styles.iconsContainer}>
          {item.type === EntityType.Candidate ? (
            <CandidatesIcon fill={colors.darkGrey} />
          ) : (
            <JobOrdersIcon fill={colors.darkGrey} />
          )}
          <Operating10Icon fill={colors.darkGrey} />
        </Box>
        <ListItemText
          primary={
            <Box style={styles.contextInfoContainer}>
              <Box flexGrow="1">
                <b>{item.title}</b> / <span>{item.subtitle}</span>
              </Box>
              <Text text={period} variant="body2" component="span" customStyle={styles.dateLabel} />
            </Box>
          }
          secondary={
            <Box mb={0.9}>
              <OperatingProgress progress={item.percentage} />
            </Box>
          }
          disableTypography
        />
        <Box style={styles.collapserContainer}>
          {uiState.isExpanded ? <ExpandLess /> : <ExpandMore />}
        </Box>
      </ListItem>
      <Collapse in={uiState.isExpanded} timeout="auto" unmountOnExit>
        <OperatingChecklist
          type={type}
          metric={item}
          isExpanded={uiState.isExpanded}
          showProfileLink
          onProfileClick={handleProfileClick}
        />
      </Collapse>
    </>
  );
};

export default OperatingItem;
