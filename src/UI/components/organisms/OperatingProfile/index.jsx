// @flow
import React, { useEffect, useState, useCallback } from 'react';

import Box from '@material-ui/core/Box';

import API from 'services/API';
import { Endpoints } from 'UI/constants/endpoints';
import { EntityType } from 'UI/constants/entityTypes';

import ActionButton from 'UI/components/atoms/ActionButton';

import OperatingSkeleton from 'UI/components/molecules/OperatingSkeleton';
import EmptyPlaceholder from 'UI/components/templates/EmptyPlaceholder';
import { EmptyMetrics, AddIcon, colors } from 'UI/res';

import OperatingMetric from '../OperatingMetric';

type OperatingProfileProps = {
  type: 'candidate' | 'joborder',
  entityId: number,
  accountability: any,
  shouldRefresh: boolean,
  onActivityClick: any => any,
  onNewClick: string => void,
  onMetricsLoaded: any => any
};

const OperatingProfile = (props: OperatingProfileProps) => {
  const {
    entityId,
    type,
    accountability,
    shouldRefresh,
    onActivityClick,
    onMetricsLoaded,
    onNewClick
  } = props;
  const [metrics, setMetrics] = useState([]);
  const [uiState, setUiState] = useState({
    isLoading: true
  });

  const getMetrics = useCallback(async () => {
    setUiState(prevState => ({ ...prevState, isLoading: true }));
    try {
      const response = await API.get(
        `${
          type === EntityType.Candidate ? Endpoints.Candidates : Endpoints.JobOrders
        }/${entityId}/metrics`
      );
      setMetrics(response.data || []);
      onMetricsLoaded && onMetricsLoaded();
    } catch (err) {
      console.log(err);
    }
    setUiState(prevState => ({ ...prevState, isLoading: false }));
  }, [entityId, type, onMetricsLoaded]);

  useEffect(() => {
    getMetrics();
  }, [getMetrics]);

  useEffect(() => {
    shouldRefresh && getMetrics();
  }, [shouldRefresh, getMetrics]);

  return !uiState.isLoading && metrics.length === 0 ? (
    <EmptyPlaceholder
      title="No metrics available"
      subtitle="Add an activity or make it an urgent item to enable the notifications and metrics"
    >
      <EmptyMetrics width="20vh" style={{ margin: 40 }} />
      <ActionButton
        text="ACTIVITY"
        type="button"
        onClick={() => onNewClick && onNewClick('activity')}
        width="100px"
        iconPosition="left"
      >
        <AddIcon fill={colors.white} size={18} />
      </ActionButton>
    </EmptyPlaceholder>
  ) : (
    <Box p={2}>
      {uiState.isLoading ? (
        <OperatingSkeleton numberOfItems={4} />
      ) : (
        metrics.map((item, index) => {
          return (
            <OperatingMetric
              key={item.id}
              metric={item}
              type={type}
              accountability={accountability}
              showProgress={index === 0}
              onActivityClick={onActivityClick}
            />
          );
        })
      )}
    </Box>
  );
};

OperatingProfile.defaultProps = {
  onNewClick: () => {},
  accountability: null
};

export default OperatingProfile;
