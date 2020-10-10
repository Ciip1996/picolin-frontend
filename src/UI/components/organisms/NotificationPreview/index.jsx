// @flow
import React, { useEffect, useCallback, useRef, useState } from 'react';
import { connect } from 'react-redux';

import Box from '@material-ui/core/Box';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';

import { CloseIcon, colors } from 'UI/res';

import TitleLabel from 'UI/components/atoms/TitleLabel';
import CustomIconButton from 'UI/components/atoms/CustomIconButton';
import NotificationsSkeleton from 'UI/components/molecules/NotificationsSkeleton';

import type { Notification } from 'types/notification';

import {
  getNotifications,
  resetNotifications as resetNotificationsAction
} from 'actions/notification';

import {
  checkNotificationPermission,
  getNotificationPermission,
  notificationPermissionTypes
} from 'services/FirebaseMessaging';

import { nestTernary } from 'UI/utils';
import { VisibilityNotifications } from 'UI/constants/defaults';
import NotificationCard from './card';
import NotificationEmpty from './empty';
import NotificationError from './error';

import { styles, useStyles } from './styles';

const SKELETON_MAX_ITEMS = Math.round(window.innerHeight / 80) + 1;

const visibilityButtons = [
  {
    id: VisibilityNotifications.All,
    label: 'All'
  },
  {
    id: VisibilityNotifications.Read,
    label: 'Read'
  },
  {
    id: VisibilityNotifications.Unread,
    label: 'Unread'
  }
];

type NotificationPreviewProps = {
  onClose: () => any,
  notifications: Notification[],
  onGetNotifications: any => void,
  resetNotifications: any => void,
  total: number,
  filterTotal: number,
  isLoading: boolean,
  hasError: boolean,
  hasMore: boolean
};

const NotificationPreview = (props: NotificationPreviewProps) => {
  const {
    onClose,
    notifications,
    onGetNotifications,
    resetNotifications,
    total,
    filterTotal,
    isLoading,
    hasError,
    hasMore
  } = props;

  const [params, setParams] = useState({
    page: 1,
    perPage: SKELETON_MAX_ITEMS,
    visibility: VisibilityNotifications.All
  });

  const observer = useRef();
  const lastNotificationElementRef = useCallback(
    node => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setParams(prevState => ({
            ...prevState,
            page: prevState.page + 1
          }));
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  useEffect(() => {
    resetNotifications();
  }, [resetNotifications]);

  useEffect(() => {
    onGetNotifications(params);
  }, [onGetNotifications, params]);

  const handleVisibilityNotificationClick = visibility => {
    resetNotifications();

    setParams({
      page: 1,
      perPage: SKELETON_MAX_ITEMS,
      visibility
    });
  };

  const classes = useStyles();

  return (
    <div role="presentation">
      <Box style={styles.drawerContainer}>
        <Box style={styles.drawerTopToolbar}>
          <CustomIconButton tooltipText="close" tooltipPosition="bottom" onClick={onClose}>
            <CloseIcon width={20} height={20} fill={colors.completeBlack} />
          </CustomIconButton>
        </Box>
        <Box style={styles.drawerContent}>
          <Box ml={3} mb={4} mr={3}>
            <TitleLabel fontSize={28} text="NOTIFICATIONS" textTransform="uppercase" />
            {total > 0 && (
              <Badge badgeContent={total} color="primary" style={styles.totalNotificationBadge} />
            )}
            <div className={classes.visibilityNotifications}>
              {visibilityButtons.map((item, i) => (
                <Chip
                  key={i.toString()}
                  label={item.label}
                  onClick={() => handleVisibilityNotificationClick(item.id)}
                  style={
                    params.visibility === item.id
                      ? styles.visibilityNotificationActive
                      : styles.visibilityNotificationNoActive
                  }
                  disabled={isLoading}
                />
              ))}
            </div>
            <div>
              {notificationPermissionTypes.Default === getNotificationPermission() && (
                <strong
                  style={{
                    maxWidth: '100%',
                    color: colors.success,
                    fontSize: 14
                  }}
                >
                  Notifications are currently off. You may miss important alerts. To receive
                  notifications,
                  <Button color="primary" onClick={() => checkNotificationPermission()}>
                    click here
                  </Button>
                  to request permission.
                </strong>
              )}
              {notificationPermissionTypes.Denied === getNotificationPermission() && (
                <strong style={{ maxWidth: '100%', color: colors.red, fontSize: 14 }}>
                  Notifications blocked. You may be missing important alerts. Allow Picolin Store&apos;s
                  notifications in your browser settings.
                </strong>
              )}
            </div>
          </Box>
          {notifications.length > 0
            ? notifications.map((item, index) => {
                if (notifications.length === index + 1 && notifications.length < filterTotal) {
                  return (
                    <div ref={lastNotificationElementRef} key={item.id}>
                      <NotificationCard notification={item} onCloseClick={onClose} />
                    </div>
                  );
                }
                return (
                  <NotificationCard key={item.id} notification={item} onCloseClick={onClose} />
                );
              })
            : nestTernary(
                isLoading,
                <NotificationsSkeleton rows={SKELETON_MAX_ITEMS} />,
                nestTernary(hasError, <NotificationError />, <NotificationEmpty />)
              )}
          {isLoading && <NotificationsSkeleton rows={2} />}
        </Box>
      </Box>
    </div>
  );
};

const mapStateToProps = ({ notification }) => {
  return {
    isLoading: notification.ui.isLoading,
    hasError: notification.ui.hasError,
    hasMore: notification.ui.hasMore,
    total: notification.domain.total,
    filterTotal: notification.domain.filterTotal,
    notifications: notification.domain.notifications
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetNotifications: params => dispatch(getNotifications(params)),
    resetNotifications: () => dispatch(resetNotificationsAction())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationPreview);
