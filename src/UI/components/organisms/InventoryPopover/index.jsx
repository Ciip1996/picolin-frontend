// @flow
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import moment from 'moment';

import { Endpoints } from 'UI/constants/endpoints';
import { DateFormats } from 'UI/constants/defaults';
import CustomAvatar from 'UI/components/atoms/CustomAvatar';
import Link from '@material-ui/core/Link';
import ActionButton from 'UI/components/atoms/ActionButton';
import { capitalizeFirstLetter, nestTernary } from 'UI/utils';
import { EntityRoutes } from 'routes/constants';
import API from 'services/API';
import { EntityType } from 'UI/constants/entityTypes';

import ColorIndicator from 'UI/components/atoms/ColorIndicator';
import { styles } from './styles';

type LastActivity = {
  title: string,
  date: string
};

type InventoryPopoverProps = {
  id: number,
  title: string,
  subtitle: string,
  subtitle2: string,
  entityType: string,
  recruiterName?: string,
  recruiterEmail?: string,
  hotItemLabel: string,
  acron: string,
  status?: string
};

const InventoryPopover = (props: InventoryPopoverProps) => {
  const {
    id,
    recruiterName,
    hotItemLabel,
    title,
    subtitle,
    subtitle2,
    recruiterEmail,
    entityType,
    acron,
    status
  } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState<LastActivity | null>(null);

  const profileUrl =
    entityType &&
    EntityRoutes[`${capitalizeFirstLetter(entityType)}Profile`] &&
    EntityRoutes[`${capitalizeFirstLetter(entityType)}Profile`].replace(':id', id);

  useEffect(() => {
    const source = axios.CancelToken.source();
    (async () => {
      try {
        setIsLoading(true);
        setLastActivity(null);
        const response = await API.get(
          `${Endpoints.Inventories}/getLastActivity?entityType=${entityType}&entityId=${id}`,
          {
            cancelToken: source.token
          }
        );
        if (response?.data) {
          setLastActivity(response.data);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      }
      setIsLoading(false);
    })();
    return () => {
      if (source) {
        source.cancel();
      }
    };
  }, [id, entityType]);

  return (
    <Box fontSize={14} fontWeight={400}>
      <Box>
        <Box fontSize={18} fontWeight={700}>
          {title}
        </Box>
        <Box>{subtitle}</Box>
        <Box>{subtitle2}</Box>
      </Box>
      <Box mt={1.5}>
        {entityType !== EntityType.Company && hotItemLabel && (
          <Box display="flex" alignItems="center">
            <Box mr={1}>
              <ColorIndicator width={11} height={11} color={status} />
            </Box>
            <span>{hotItemLabel}</span>
          </Box>
        )}
        <Box display="flex" alignItems="center">
          <Box component="span" mr={1}>
            Last activity:
          </Box>
          {isLoading ? (
            <CircularProgress size={18} />
          ) : (
            nestTernary(
              !!lastActivity,
              <b>
                {lastActivity?.title} -{' '}
                {lastActivity?.date
                  ? moment(lastActivity?.date).format(DateFormats.SimpleDate)
                  : ''}
              </b>,
              <>No recently</>
            )
          )}
        </Box>
      </Box>
      <hr />
      <Box display="flex" alignItems="flex-start" mb={2.2}>
        <Box mr={1}>
          <CustomAvatar acron={acron} />
        </Box>
        <Box fontSize={14} display="flex" flexDirection="column">
          <Box>
            Recruiter: <b>{recruiterName}</b>
          </Box>
          {/* ToDo add contact functionalities */}
          <Link href={profileUrl} target="_blank" rel="noopener noreferrer">
            {recruiterEmail}
          </Link>
        </Box>
      </Box>
      <ActionButton
        text="PROFILE"
        style={styles.link}
        id={id}
        href={profileUrl}
        target="_blank"
        rel="noopener noreferrer"
      />
    </Box>
  );
};

InventoryPopover.defaultProps = {
  hotItemLabel: '',
  recruiterName: '',
  recruiterEmail: '',
  status: '',
  subtitle2: ''
};

export default InventoryPopover;
