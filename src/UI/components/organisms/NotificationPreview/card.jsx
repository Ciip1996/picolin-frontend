// @flow
import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import ColorIndicator from 'UI/components/atoms/ColorIndicator';

import { colors, AnnouncementIcon } from 'UI/components/molecules/ProductCard/node_modules/UI/res';

import { icon as iconDimensions } from 'UI/constants/dimensions';
import { type notificationsType, notificationIcons } from 'UI/constants/notifications';
import { markNotificationAsRead as markNotificationAsReadAction } from 'actions/notification';

import { styles, useStyles } from './styles';

type IconListProps = {
  icon: notificationsType,
  color: string
};

const IconList = (props: IconListProps) => {
  const { icon, color } = props;
  const notification = notificationIcons.find(n => {
    return n.key === icon;
  }) || { icon: <AnnouncementIcon /> };

  return {
    ...notification.icon,
    props: { fill: color, size: iconDimensions.size }
  };
};

type NotificationCardProps = {
  notification: any,
  markNotificationAsRead: any,
  history: any,
  onCloseClick: () => any,
  ref: any
};

const NotificationCard = (props: NotificationCardProps) => {
  const { notification, markNotificationAsRead, history, onCloseClick, ref } = props;

  const classes = useStyles({
    indicatorColor: notification.read_on ? colors.lightgray : notification.color,
    createdColor: notification.read_on ? colors.oxford : colors.success
  });
  const backgroundCard = notification.read_on ? classes.read : classes.root;

  const handleClick = async item => {
    !item.read_on && markNotificationAsRead(item);
    onCloseClick && onCloseClick();
    history.push(item.click_action);
  };

  return (
    <Card ref={ref} className={backgroundCard} onClick={() => handleClick(notification)}>
      <div className={classes.leftIndicator} />
      <CardActions className={classes.iconContainer}>
        <div className={classes.icon}>
          <IconList icon={notification.icon} color={notification.color} />
        </div>
      </CardActions>
      <CardContent>
        <div className={classes.textContainer}>
          <div className={classes.title} style={styles.truncateText}>
            {notification.title}
          </div>
          <div className={classes.body} style={styles.truncateText}>
            {notification.body}
          </div>
          <div className={classes.created}>{moment(notification.created_at).fromNow()}</div>
        </div>
      </CardContent>
      <CardActions className={classes.indicatorContainer}>
        <div className={classes.indicator}>
          {!notification.read_on && (
            <ColorIndicator mode="color" color={colors.success} width={12} height={12} />
          )}
        </div>
      </CardActions>
    </Card>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    markNotificationAsRead: notification => dispatch(markNotificationAsReadAction(notification))
  };
};

export default connect(null, mapDispatchToProps)(withRouter(NotificationCard));
