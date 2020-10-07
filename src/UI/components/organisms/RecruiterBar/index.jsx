// @flow
import React from 'react';
import moment from 'moment';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';

import RecruiterCard from 'UI/components/organisms/RecruiterCard';
import ActionButton from 'UI/components/atoms/ActionButton';
import InfoLabel from 'UI/components/molecules/InfoLabel';
import { nestTernary } from 'UI/utils';
import { DateFormats, RecruiterBarMode } from 'UI/constants/defaults';
import { useAccountability } from 'hooks/accountability';
import { globalStyles } from 'GlobalStyles';
import { EntityType } from 'UI/constants/entityTypes';

import { Roles } from 'UI/constants/roles';
import { getCurrentUser } from 'services/Authentication';
import { userHasRole } from 'services/Authorization';

type RecruiterBarProps = {
  item: any,
  entityType: any,
  isLoading: boolean,
  onAssignClick: () => any
};

const RecruiterBar = (props: RecruiterBarProps) => {
  const { item, entityType, isLoading, onAssignClick } = props;
  const { recruiter, coach, created_at, free_game: isFreeGame } = item;

  const addedDate = created_at ? moment(created_at).format(DateFormats.SimpleDate) : '';

  const currentUser = getCurrentUser();
  const isUserCoach = userHasRole(Roles.Coach);

  const {
    assistantRecruiter,
    accountableRecruiter,
    assistantForAccountableRecruiter,
    isItemMine,
    isAssistantRecruiter,
    isTeamworkEntity
  } = useAccountability(currentUser, item, entityType);

  const handleRequestClick = async e => {
    e.preventDefault();

    onAssignClick && onAssignClick();
  };

  const shouldSplitBar =
    (isTeamworkEntity && isFreeGame && !isAssistantRecruiter) || !!accountableRecruiter;

  const renderRequestSection = () => {
    const requestButtonText = isUserCoach
      ? 'Assign to recruiter'
      : nestTernary(entityType.id === EntityType.Candidate, 'Start marketing', 'Start recruiting');

    return (
      <Card style={globalStyles.cardContainer}>
        <CardHeader
          title={
            isItemMine ? (
              <InfoLabel title="Item status" titleLabel="Free Game" description="Free Game" />
            ) : (
              <ActionButton
                iconPosition="none"
                style={{ width: '100%' }}
                text={requestButtonText}
                type="button"
                onClick={handleRequestClick}
              />
            )
          }
          disableTypography
        />
      </Card>
    );
  };

  return isLoading ? (
    <Grid container>
      <Grid item xs={12}>
        <RecruiterCard isLoading={isLoading} mode={RecruiterBarMode.Large} />
      </Grid>
    </Grid>
  ) : (
    nestTernary(
      shouldSplitBar,
      <Grid container spacing={2}>
        <Grid item sm={6} xs={12}>
          {recruiter && (
            <RecruiterCard
              recruiter={recruiter}
              coach={coach}
              assistant={assistantRecruiter?.recruiter}
              date={addedDate}
              mode={RecruiterBarMode.Compact}
            />
          )}
        </Grid>
        <Grid item sm={6} xs={12}>
          {accountableRecruiter ? (
            <RecruiterCard
              recruiter={accountableRecruiter?.recruiter}
              coach={accountableRecruiter?.coach}
              assistant={assistantForAccountableRecruiter?.recruiter}
              date={addedDate}
              mode={RecruiterBarMode.Compact}
            />
          ) : (
            renderRequestSection()
          )}
        </Grid>
      </Grid>,
      <Grid container>
        <Grid item xs={12}>
          {recruiter && (
            <RecruiterCard
              recruiter={recruiter}
              coach={coach}
              assistant={assistantRecruiter?.recruiter}
              date={addedDate}
              mode={RecruiterBarMode.Large}
            />
          )}
        </Grid>
      </Grid>
    )
  );
};

RecruiterBar.defaultProps = {
  isLoading: false,
  item: null,
  entityType: null,
  onAssignClick: undefined
};

export default RecruiterBar;
