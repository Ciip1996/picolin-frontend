// @flow
import React from 'react';
import Box from '@material-ui/core/Box';
import Text from 'UI/components/atoms/Text';
import { BorderLinearProgress } from './styles';

type OperatingProgressProps = {
  progress: number
};

const OperatingProgress = (props: OperatingProgressProps) => {
  const { progress } = props;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between">
        <Text text="Progress" variant="body2" component="span" />
        <strong>{progress}%</strong>
      </Box>
      <BorderLinearProgress
        variant="determinate"
        value={progress}
        completed={100 - progress < 1 || undefined}
      />
    </Box>
  );
};

export default OperatingProgress;
