/* eslint-disable no-prototype-builtins */
/* eslint-disable no-console */
// @flow
import { messaging } from 'services/Firebase';
import { isAuthenticated } from 'services/Authentication';

const NOTIFICATION_TOKEN = 'notificationToken';
const NOTIFICATION_PERMISSION = 'notificationPermission';

export const getNotificationToken = () => {
  const token = localStorage.getItem(NOTIFICATION_TOKEN);
  return token;
};

export const getNotificationPermission = () => {
  return localStorage.getItem(NOTIFICATION_PERMISSION);
};

export const isNotificationAvailable = isAuthenticated() && getNotificationToken();

export const notificationPermissionTypes = {
  Default: 'default',
  Denied: 'denied',
  Granted: 'granted'
};

export const checkNotificationPermission = () => {
  if (Notification.permission === notificationPermissionTypes.Granted) {
    getCurrentToken(); // If Premission granted proceed towards token fetch
  } else {
    localStorage.removeItem(NOTIFICATION_TOKEN);
    requestPermission(); // If permission hasn’t been granted to our app, request user in requestPermission method.
  }
};

const getCurrentToken = async () => {
  let token = await localStorage.getItem(NOTIFICATION_TOKEN);

  if (!token) {
    token = messaging && (await messaging.getToken());
    if (token) {
      await localStorage.setItem(NOTIFICATION_TOKEN, token); // user has a device token
      localStorage.removeItem(NOTIFICATION_PERMISSION);
      window.location.reload();
    }
  }
};

const requestPermission = async () => {
  try {
    messaging && (await messaging.requestPermission());
    getCurrentToken();
  } catch (err) {
    if (err.hasOwnProperty('code') && err.code === 'messaging/permission-default') {
      console.log('You need to allow the site to send notifications');
      await localStorage.setItem(NOTIFICATION_PERMISSION, notificationPermissionTypes.Default);
    } else if (err.hasOwnProperty('code') && err.code === 'messaging/permission-blocked') {
      console.log(
        'Currently, the site is blocked from sending notifications. Please unblock the same in your browser settings'
      );
      await localStorage.setItem(NOTIFICATION_PERMISSION, notificationPermissionTypes.Denied);
    } else console.log('Unable to subscribe you to notifications');
  }
};
