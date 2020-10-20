// @flow
import React from 'react';
import {
  FeeAgreementReceived,
  FeeAgreementReviewed,
  NewInventoryItemNotificationIcon,
  StatusInventoryItemNotificationIcon,
  Operating10Icon,
  CollaborationsIcon,
  colors
} from 'UI/res';

export type notificationsType =
  | 'feeAgreementDeclined'
  | 'feeAgreementSigned'
  | 'feeAgreementValidate'
  | 'newInventoryItemNotificationIcon'
  | 'statusInventoryItemNotificationIcon'
  | 'collaborations'
  | 'operating10';

export const notificationIcons = [
  {
    key: 'feeAgreementDeclined',
    icon: <FeeAgreementReviewed fill={colors.black} />
  },
  {
    key: 'feeAgreementSigned',
    icon: <FeeAgreementReviewed fill={colors.black} />
  },
  {
    key: 'feeAgreementValidate',
    icon: <FeeAgreementReceived fill={colors.black} />
  },
  {
    key: 'newInventoryItemNotificationIcon',
    icon: <NewInventoryItemNotificationIcon fill={colors.success} />
  },
  {
    key: 'statusInventoryItemNotificationIcon',
    icon: <StatusInventoryItemNotificationIcon fill={colors.success} />
  },
  {
    key: 'operating10',
    icon: <Operating10Icon fill={colors.success} />
  },
  {
    key: 'collaborations',
    icon: <CollaborationsIcon fill={colors.success} />
  }
];
