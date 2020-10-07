// @flow
import queryString from 'query-string';

import { getErrorMessage } from 'UI/utils/index';
import API from 'services/API';
import { Endpoints } from 'UI/constants/endpoints';
import { VisibilityNotifications } from 'UI/constants/defaults';
import type { Dispatch, GetState } from 'types/redux';
import { makeActionCreator } from './index';
import { showAlert } from './app';

export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
export const MARK_NOTIFICATION_READ = 'MARK_NOTIFICATION_READ';
export const FETCH_NOTIFICATION_REQUEST = 'FETCH_NOTIFICATION_REQUEST';
export const FETCH_NOTIFICATION_FAILURE = 'FETCH_NOTIFICATION_FAILURE';
export const FETCH_NOTIFICATION_SUCCESS = 'FETCH_NOTIFICATION_SUCCESS';
export const APPLY_NOTIFICATION_PARAMS = 'APPLY_NOTIFICATION_PARAMS';
export const RESET_NOTIFICATIONS = 'RESET_NOTIFICATIONS';
export const FETCH_TOTAL_SUCCESS = 'FETCH_TOTAL_SUCCESS';

export const markNotificationAsReadClick = makeActionCreator(MARK_NOTIFICATION_READ, 'payload');
export const addNotification = makeActionCreator(ADD_NOTIFICATION, 'payload');
export const requestResults = makeActionCreator(FETCH_NOTIFICATION_REQUEST);
export const receiveNotificationResults = makeActionCreator(FETCH_NOTIFICATION_SUCCESS, 'payload');
export const receiveTotals = makeActionCreator(FETCH_TOTAL_SUCCESS, 'payload');

export const failResults = makeActionCreator(FETCH_NOTIFICATION_FAILURE);
export const submitQueryParamsNotification = makeActionCreator(
  APPLY_NOTIFICATION_PARAMS,
  'payload'
);
export const resetNotifications = makeActionCreator(RESET_NOTIFICATIONS);

/** Async action to fetch results */
export function getNotifications(
  params: any = {
    page: 1,
    perPage: 10,
    visibility: VisibilityNotifications.All
  }
) {
  return (dispatch: Dispatch) => {
    dispatch(submitQueryParamsNotification(params));
    return dispatch(fetchResults(Endpoints.NotificationHistory, receiveNotificationResults));
  };
}

/** Async action to fetch results */
export function getTotal() {
  return (dispatch: Dispatch) => {
    return dispatch(fetchTotal(Endpoints.NotificationHistory));
  };
}

const fetchResults = (url: string, resultsAction) => {
  return async (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const { params } = state.notification.domain;

    dispatch(requestResults());

    const queryParams = queryString.stringify(params);

    try {
      const { data } = await API.get(`${url}?${queryParams}`);
      dispatch(resultsAction(data));
    } catch (err) {
      dispatch(failResults());
      dispatch(
        showAlert({
          severity: 'error',
          title: 'Oops',
          body: getErrorMessage(err)
        })
      );
    }
  };
};

const fetchTotal = (url: string) => {
  return async (dispatch: Dispatch) => {
    const queryParams = queryString.stringify({
      page: 1,
      perPage: 1,
      visibility: VisibilityNotifications.All
    });

    try {
      const { data } = await API.get(`${url}?${queryParams}`);
      dispatch(receiveTotals(data));
    } catch (err) {
      dispatch(
        showAlert({
          severity: 'error',
          title: 'Oops',
          body: getErrorMessage(err)
        })
      );
    }
  };
};

/** Async action to fetch mark notification as read */
export function markNotificationAsRead(notification: any) {
  return (dispatch: Dispatch) => {
    return dispatch(
      fetchMarkNotificationAsRead(
        Endpoints.NotificationMarkAsRead,
        notification,
        markNotificationAsReadClick
      )
    );
  };
}

const fetchMarkNotificationAsRead = (url: string, data: any, resultsAction) => {
  const params = {
    notificationId: data.id
  };

  return async (dispatch: Dispatch) => {
    try {
      await API.post(`${url}`, params);
      dispatch(resultsAction(data));
    } catch (err) {
      dispatch(
        showAlert({
          severity: 'error',
          title: 'Oops',
          body: getErrorMessage(err)
        })
      );
    }
  };
};
