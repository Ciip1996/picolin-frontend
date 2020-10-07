// @flow

import { combineReducers } from 'redux';
import type { Action } from 'types/redux';
import type { DashboardUiState, DashboardDomainState } from 'types/dashboard';

import { SAVE_FILTERS, RESET_FILTERS, ADD_FILTER, TOGGLE_MENU } from 'actions/dashboard';

const uiReducer = (
  state: DashboardUiState = {},
  action: Action = { type: '', payload: {} }
): DashboardUiState => {
  const { type } = action;
  switch (type) {
    case TOGGLE_MENU:
      return { ...state, isSideMenuOpen: !state.isSideMenuOpen };
    case SAVE_FILTERS:
      return { ...state, isSideMenuOpen: false };
    default:
      return state;
  }
};

const domainReducer = (
  state: DashboardDomainState = {},
  action: Action = { type: '', payload: {} }
): DashboardDomainState => {
  const { type, payload } = action;
  switch (type) {
    case RESET_FILTERS:
      return { ...state, filters: {} };
    case SAVE_FILTERS:
      return { ...state, filters: payload };
    case ADD_FILTER:
      return { ...state, filters: { ...state.filters, ...payload } };
    default:
      return state;
  }
};

const dashboardReducer = combineReducers({ domain: domainReducer, ui: uiReducer });

/** Reducer that combines domain and app reducer */
export default dashboardReducer;
