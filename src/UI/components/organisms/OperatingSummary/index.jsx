// @flow
import React, { useState, useEffect } from 'react';
import queryString from 'query-string';

import List from '@material-ui/core/List';
import Box from '@material-ui/core/Box';

import OperatingSkeleton from 'UI/components/molecules/OperatingSkeleton';
import EmptyPlaceholder from 'UI/components/templates/EmptyPlaceholder';
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';

import { NotificationEmptyImg } from 'UI/res';

import API from 'services/API';
import { Endpoints } from 'UI/constants/endpoints';
import { EntityType } from 'UI/constants/entityTypes';
import { nestTernary } from 'UI/utils';
import { userHasRole } from 'services/Authorization';
import { Roles } from 'UI/constants/roles';

import OperatingItem from '../OperatingItem';
import { styles } from './styles';

type OperatingSummaryProps = {
  type: 'candidate' | 'joborder',
  onProfileClick: number => void
};

const ITEM_HEIGHT = 100;
const HEADER_HEIGHT = 200;
const SKELETON_MAX_ITEMS = Math.round((window.innerHeight - HEADER_HEIGHT) / ITEM_HEIGHT);

const OperatingSummary = (props: OperatingSummaryProps) => {
  const { type, onProfileClick } = props;
  const [uiState, setUiState] = useState({
    isLoading: false
  });
  const [operatingItems, setOperatingItems] = useState([]);
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const filters = queryString.stringify({ recruiterId: selectedRecruiter?.id });

  useEffect(() => {
    async function getMetrics() {
      setUiState(prevState => ({ ...prevState, isLoading: true }));
      try {
        const response = await API.get(
          `${
            type === EntityType.Candidate ? Endpoints.Candidates : Endpoints.JobOrders
          }/metrics/byUser?${filters}`
        );
        if (response.data) {
          setOperatingItems(response.data);
        }
      } catch (err) {
        console.log(err);
      }
      setUiState(prevState => ({ ...prevState, isLoading: false }));
    }

    getMetrics();
  }, [type, filters]);

  const handleRecruiterSelect = (name?: string, value: any) => {
    setSelectedRecruiter(value);
  };

  const isUserCoach = userHasRole(Roles.Coach);

  const filterStyles = { ...styles.filterContainer, display: uiState.isLoading ? 'none' : 'block' };

  return (
    <>
      {isUserCoach && (
        <Box style={filterStyles}>
          <AutocompleteSelect
            name="recruiterId"
            placeholder="Filter by recruiter"
            url={`${Endpoints.Recruiters}/myTeam`}
            selectedValue={selectedRecruiter}
            onSelect={handleRecruiterSelect}
            displayKey="full_name"
          />
        </Box>
      )}
      {uiState.isLoading ? (
        <OperatingSkeleton numberOfItems={SKELETON_MAX_ITEMS} variant="list" />
      ) : (
        nestTernary(
          operatingItems.length > 0,
          <>
            <List>
              {operatingItems.map(item => (
                <OperatingItem
                  key={item.id}
                  item={item}
                  type={type}
                  onProfileClick={onProfileClick}
                />
              ))}
            </List>
          </>,
          <EmptyPlaceholder
            title="Nothing to show here yet"
            subtitle="Your hot items will appear here."
          >
            <NotificationEmptyImg style={{ marginTop: 20 }} />
          </EmptyPlaceholder>
        )
      )}
    </>
  );
};

export default OperatingSummary;
