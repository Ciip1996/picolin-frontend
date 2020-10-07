// @flow
import { combineReducers } from 'redux';
import type { Action } from 'types/redux';
import type { NotificationUiState, NotificationDomainState } from 'types/notification';

import {
  ADD_NOTIFICATION,
  MARK_NOTIFICATION_READ,
  FETCH_NOTIFICATION_REQUEST,
  FETCH_NOTIFICATION_FAILURE,
  FETCH_NOTIFICATION_SUCCESS,
  FETCH_TOTAL_SUCCESS,
  APPLY_NOTIFICATION_PARAMS,
  RESET_NOTIFICATIONS
} from 'actions/notification';

const uiReducer = (
  state: NotificationUiState = {},
  action: Action = { type: '', payload: null }
): NotificationUiState => {
  const { type, payload } = action;

  switch (type) {
    case FETCH_NOTIFICATION_REQUEST:
      return { ...state, isLoading: true, hasError: false, hasMore: false };
    case FETCH_NOTIFICATION_FAILURE:
      return { ...state, isLoading: false, hasError: true, hasMore: false };
    case FETCH_NOTIFICATION_SUCCESS:
      return { ...state, isLoading: false, hasError: false, hasMore: payload.data.length > 0 };
    default:
      return state;
  }
};

const domainReducer = (
  state: NotificationDomainState = {},
  action: Action = { type: '', payload: {} }
): NotificationDomainState => {
  const { type, payload } = action;

  switch (type) {
    case ADD_NOTIFICATION:
      return {
        ...state,
        notifications:
          state.params.visibility === 'all' || state.params.visibility === 'unread'
            ? [payload, ...state.notifications]
            : [...state.notifications],
        total: state.total + 1
      };
    case MARK_NOTIFICATION_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id !== payload.id
            ? notification
            : { ...notification, read_on: new Date().toISOString() }
        ),
        total: state.total - 1
      };
    case RESET_NOTIFICATIONS:
      return { ...state, params: { page: 1 }, notifications: [] };
    case APPLY_NOTIFICATION_PARAMS:
      return { ...state, params: payload };
    case FETCH_NOTIFICATION_SUCCESS:
      return {
        ...state,
        notifications: [...state.notifications, ...payload.data],
        total: payload.total,
        filterTotal: payload.filterTotal
      };
    case FETCH_TOTAL_SUCCESS:
      return {
        ...state,
        total: payload.total
      };
    default:
      return state;
  }
};
const notificationReducer = combineReducers({ domain: domainReducer, ui: uiReducer });

export default notificationReducer;
