// @flow

import { combineReducers } from 'redux';
import type { Action } from 'types/redux';
import type { MapUiState, MapDomainState } from 'types/map';

import {
  SELECT_TAB,
  RESET_FILTERS,
  TOGGLE_MENU,
  SEARCH_DIG,
  SEARCH_INVENTORY,
  SELECT_RECRUITER,
  FETCH_RESULTS_REQUEST,
  FETCH_DIG_SUCCESS,
  FETCH_INVENTORY_SUCCESS,
  FETCH_RESULTS_FAILURE
} from 'actions/map';

const uiReducer = (
  state: MapUiState = {},
  action: Action = { type: '', payload: {} }
): MapUiState => {
  const { type, payload } = action;
  switch (type) {
    case SELECT_TAB:
      return { ...state, activeTab: payload, hasLoaded: false };
    case RESET_FILTERS:
      return { ...state, hasLoaded: false };
    case TOGGLE_MENU:
      return { ...state, isSideMenuOpen: !state.isSideMenuOpen };
    case SELECT_RECRUITER:
      return { ...state, selectedRecruiter: payload };
    case FETCH_RESULTS_REQUEST:
      return { ...state, isLoading: true, hasLoaded: false, lastError: null };
    case FETCH_RESULTS_FAILURE:
      return { ...state, lastError: payload, hasLoaded: true, isLoading: false };
    case FETCH_DIG_SUCCESS:
    case FETCH_INVENTORY_SUCCESS:
      return { ...state, isLoading: false, hasLoaded: true };
    default:
      return state;
  }
};

const domainReducer = (
  state: MapDomainState = {},
  action: Action = { type: '', payload: {} }
): MapDomainState => {
  const { type, payload } = action;
  switch (type) {
    case SELECT_TAB:
      return { ...state, markers: [], recruiters: [], filters: {} };
    case RESET_FILTERS:
      return { ...state, markers: [], recruiters: [], filters: {} };
    case SEARCH_DIG:
    case SEARCH_INVENTORY:
      return { ...state, filters: payload, markers: [] };
    case FETCH_DIG_SUCCESS:
      return { ...state, markers: payload.map, recruiters: payload.list };
    case FETCH_INVENTORY_SUCCESS:
      return { ...state, markers: payload };
    default:
      return state;
  }
};

const mapReducer = combineReducers({ domain: domainReducer, ui: uiReducer });

/** Reducer that combines domain and app reducer */
export default mapReducer;
