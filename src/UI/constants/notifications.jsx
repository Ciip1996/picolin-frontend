// @flow
import React from 'react';
import { FeeAgreementReviewed, colors } from 'UI/res';

export type notificationsType = 'feeAgreementDeclined';

export const notificationIcons = [
  {
    // NOTE: Will leave this one as example of how to use it
    key: 'feeAgreementDeclined',
    icon: <FeeAgreementReviewed fill={colors.black} />
  }
];
