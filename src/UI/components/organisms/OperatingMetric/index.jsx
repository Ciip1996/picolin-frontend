// @flow
import React, { useState } from 'react';

import Collapse from '@material-ui/core/Collapse';
import Box from '@material-ui/core/Box';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';

import { formatMetricPeriod } from 'UI/utils';
import { colors, Operating10Icon } from 'UI/res';
import CustomAvatar from 'UI/components/atoms/CustomAvatar';
import CustomIconButton from 'UI/components/atoms/CustomIconButton';
import OperatingChecklist from '../OperatingChecklist';
import OperatingProgress from '../../molecules/OperatingProgress';

import { styles } from './styles';

type OperatingMetricProps = {
  metric: any,
  accountability: any,
  type: 'candidate' | 'joborder',
  showProgress: boolean,
  onActivityClick: any => any
};

const OperatingMetric = (props: OperatingMetricProps) => {
  const { metric, type, accountability, showProgress: showProgressBar, onActivityClick } = props;
  const [uiState, setUiState] = useState({
    isExpanded: showProgressBar
  });

  const handleToggle = () => {
    setUiState(prevState => ({
      ...prevState,
      isExpanded: !prevState.isExpanded
    }));
  };

  const period = formatMetricPeriod(metric);
  return (
    <Card variant="outlined" style={styles.card}>
      <CardHeader
        avatar={<CustomAvatar acron={metric.recruiter?.initials} style={styles.avatar} />}
        action={
          <CustomIconButton>
            {uiState.isExpanded ? <ExpandLess /> : <ExpandMore />}
          </CustomIconButton>
        }
        title={
          <Box display="flex">
            <Box flexGrow="1">
              <b>{metric.recruiter?.personalInformation?.full_name}</b> / {period}
            </Box>
            {!showProgressBar && <strong>{metric.percentage}%</strong>}
          </Box>
        }
        onClick={handleToggle}
        disableTypography
        style={styles.card.header}
      />
      {showProgressBar && (
        <CardContent style={styles.card.content}>
          <Box display="flex" flexDirection="row" alignItems="center">
            <Operating10Icon fill={colors.offlineGray} size={30} style={styles.operatingIcon} />
            <Box style={styles.card.content.progress}>
              <OperatingProgress progress={metric.percentage} />
            </Box>
          </Box>
        </CardContent>
      )}
      <Collapse in={uiState.isExpanded} timeout="auto" unmountOnExit>
        <Divider style={{ height: 1 }} />
        <OperatingChecklist
          type={type}
          metric={metric}
          accountability={accountability}
          isExpanded={uiState.isExpanded}
          showProfileLink={false}
          onActivityClick={onActivityClick}
        />
      </Collapse>
    </Card>
  );
};
OperatingMetric.defaultProps = {
  accountability: null
};

export default OperatingMetric;
