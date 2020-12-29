// @flow
import { combineReducers } from 'redux';
import type { Action } from 'types/redux';
import type { AppUiState, AppDomainState } from 'types/app';

import {
  SHOW_ALERT,
  HIDE_ALERT,
  SIGNIN_USER,
  SHOW_CONFIRMATION,
  HIDE_CONFIRMATION
} from 'actions/app';

const uiReducer = (
  state: AppUiState = {},
  action: Action = { type: '', payload: {} }
): AppUiState => {
  const { type, payload } = action;
  switch (type) {
    case SHOW_ALERT:
      return {
        ...state,
        alerts: [
          ...state.alerts,
          {
            key: new Date().getTime() + Math.random(),
            ...payload
          }
        ]
      };
    case HIDE_ALERT:
      return {
        ...state,
        alerts: state.alerts.filter(alert => alert.key !== payload)
      };
    case SHOW_CONFIRMATION:
      return {
        ...state,
        confirmation: payload
      };
    case HIDE_CONFIRMATION:
      return {
        ...state,
        confirmation: null
      };
    default:
      return state;
  }
};

const domainReducer = (
  state: AppDomainState = {},
  action: Action = { type: '', payload: {} }
): AppDomainState => {
  const { type, payload } = action;
  switch (type) {
    case SIGNIN_USER:
      return { ...state, currentUser: payload };
    default:
      return state;
  }
};

const appReducer = combineReducers({ domain: domainReducer, ui: uiReducer });

export default appReducer;
