// @flow
import React from 'react';
import { connect } from 'react-redux';

import Badge from '@material-ui/core/Badge';

import CustomIconButton from 'UI/components/atoms/CustomIconButton';
import { NotificationIcon, colors } from 'UI/res';

type NotificationButtonProps = {
  onDrawerOpen: () => any,
  total: number
};

const NotificationButton = (props: NotificationButtonProps) => {
  const { onDrawerOpen, total } = props;

  return (
    <CustomIconButton
      tooltipText="Notifications"
      onClick={onDrawerOpen}
      style={{
        marginRight: 10
      }}
    >
      {total ? (
        <Badge color="primary" badgeContent={total}>
          <NotificationIcon fill={colors.completeBlack} />
        </Badge>
      ) : (
        <NotificationIcon fill={colors.completeBlack} />
      )}
    </CustomIconButton>
  );
};

const mapStateToProps = ({ notification }) => {
  return {
    total: notification.domain.total
  };
};

export default connect(mapStateToProps)(NotificationButton);
