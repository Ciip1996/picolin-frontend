// @flow
import React from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import Button from '@material-ui/core/Button';

import { EntityRoutes } from 'routes/constants';
import { colors } from 'UI/res';
import { EntityType } from 'UI/constants/entityTypes';
import { DateFormats } from 'UI/constants/defaults';
import { toLocalTime, nestTernary } from 'UI/utils';

import StyledTooltip from 'UI/components/atoms/StyledTooltip/styles';
import { styles } from './styles';

type OperatingChecklistProps = {
  isExpanded: boolean,
  showProfileLink: boolean,
  type: 'candidate' | 'joborder',
  accountability: any,
  metric: any,
  onProfileClick: number => any,
  onActivityClick: any => any
};

const OperatingChecklist = (props: OperatingChecklistProps) => {
  const history = useHistory();
  const {
    type,
    accountability = {},
    metric,
    isExpanded,
    showProfileLink,
    onProfileClick,
    onActivityClick
  } = props;

  const { id, checklist = [], end_date, created_by } = metric;
  const isInDrawer = showProfileLink;

  const handleProfileClick = () => {
    if (type === EntityType.Candidate)
      history.push(`${EntityRoutes.CandidateProfile.replace(':id', id)}?tab=metrics`);
    else if (type === EntityType.Joborder)
      history.push(`${EntityRoutes.JobOrderProfile.replace(':id', id)}?tab=metrics`);

    onProfileClick && onProfileClick(id);
  };

  const handleItemClick = (item: any) => {
    !item.completed && onActivityClick && onActivityClick(item);
  };

  const {
    mainRecruiter,
    accountableRecruiter,
    isMainRecruiter,
    isAccountableRecruiter,
    isMainAssistant,
    isAccountableAssistant
  } = accountability;

  const metricEndDate = toLocalTime(end_date);
  const isMetricActive = moment().isBefore(metricEndDate);
  const mainRecruiterOwnsMetric = created_by === mainRecruiter?.id;
  const accountableRecruiterOwnsMetric = created_by === accountableRecruiter?.recruiter_id;
  const canClick =
    (mainRecruiterOwnsMetric && (isMainRecruiter || isMainAssistant)) ||
    (accountableRecruiterOwnsMetric && (isAccountableRecruiter || isAccountableAssistant));

  return (
    <List component="div" dense style={isInDrawer ? styles.checklistInDrawer : null}>
      <ListItem key="details">
        <ListItemText primary="Details" />
      </ListItem>
      {checklist.map(item => {
        const isClickable = !item.completed && !isInDrawer && isMetricActive && canClick;
        const localTime = toLocalTime(item.completedAt);
        const formattedDate = localTime ? localTime.format(DateFormats.SimpleDateTime) : '';

        const completedAt = item?.completedAt ? formattedDate : '';
        const completedBy =
          (item.completed &&
            ` by ${item.reference?.user?.initials || item.reference?.user?.email}`) ||
          '';
        const tooltip = item.completed
          ? `Completed on ${completedAt} ${completedBy}`
          : nestTernary(
              !isMetricActive,
              'Activity not completed within period',
              nestTernary(
                canClick,
                'Click to complete this activity',
                nestTernary(
                  !isInDrawer,
                  'Only the assigned recruiter or collaborator can complete this activity',
                  ''
                )
              )
            );

        return (
          <ListItem
            key={item.activityId}
            button={isClickable}
            onClick={() => isClickable && handleItemClick(item)}
          >
            <ListItemIcon style={styles.listItemIcon}>
              <CheckCircleIcon htmlColor={item.completed ? colors.active : colors.offlineGray} />
            </ListItemIcon>
            <StyledTooltip title={tooltip} placement="top-start">
              <ListItemText primary={item.title} />
            </StyledTooltip>
          </ListItem>
        );
      })}

      {showProfileLink && (
        <ListItem style={{ justifyContent: 'flex-end' }} divider={isExpanded && showProfileLink}>
          <Button color="primary" onClick={handleProfileClick}>
            Go to profile
          </Button>
        </ListItem>
      )}
    </List>
  );
};

OperatingChecklist.defaultProps = {
  onProfileClick: () => {},
  onActivityClick: () => {},
  accountability: undefined
};

export default OperatingChecklist;
