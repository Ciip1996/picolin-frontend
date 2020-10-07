// @flow

import queryString from 'query-string';

import { getErrorMessage } from 'UI/utils/index';
import API from 'services/API';
import { Endpoints } from 'UI/constants/endpoints';
import type { Dispatch, GetState } from 'types/redux';
import { filtersToParams } from 'selectors/app';
import { makeActionCreator } from './index';
import { showAlert } from './app';

export const SELECT_TAB = 'SELECT_TAB';
export const TOGGLE_MENU = 'TOGGLE_MENU';
export const SEARCH_DIG = 'SEARCH_DIG';
export const SEARCH_INVENTORY = 'SEARCH_INVENTORY';
export const SELECT_RECRUITER = 'SELECT_RECRUITER';
export const RESET_FILTERS = 'RESET_FILTERS';
export const SAVE_FILTERS = 'SAVE_FILTERS';

export const FETCH_RESULTS_REQUEST = 'FETCH_RESULTS_REQUEST';
export const FETCH_RESULTS_FAILURE = 'FETCH_RESULTS_FAILURE';
export const FETCH_DIG_SUCCESS = 'FETCH_DIG_SUCCESS';
export const FETCH_INVENTORY_SUCCESS = 'FETCH_INVENTORY_SUCCESS';

/** Action creator for SELECT_RECRUITER action */
export const selectRecruiter = makeActionCreator(SELECT_RECRUITER, 'payload');

/** Action creator for SELECT_RECRUITER action */
export const resetFilters = makeActionCreator(RESET_FILTERS);

/** Action creator for TOGGLE_MENU action */
export const toggleMenu = makeActionCreator(TOGGLE_MENU);

/** Action creator for SELECT_SORTING action */
export const selectTab = makeActionCreator(SELECT_TAB, 'payload');

export const saveFilters = makeActionCreator(SAVE_FILTERS, 'payload');

export const submitSearchDig = makeActionCreator(SEARCH_DIG, 'payload');

export const submitSearchInventory = makeActionCreator(SEARCH_INVENTORY, 'payload');

/** Async action to look for dig */
export function searchDig(filters: any) {
  return (dispatch: Dispatch) => {
    dispatch(submitSearchDig(filters));
    return dispatch(fetchDigResults());
  };
}

/** Async action to look for inventory */
export function searchInventory(filters: any) {
  return (dispatch: Dispatch) => {
    dispatch(submitSearchInventory(filters));
    return dispatch(fetchInventoryResults());
  };
}

/** Action creator for FETCH_RESULTS_REQUEST action */
export const requestResults = makeActionCreator(FETCH_RESULTS_REQUEST);

/** Action creator for FETCH_RESULTS_SUCCESS action */
export const receiveDigResults = makeActionCreator(FETCH_DIG_SUCCESS, 'payload');

/** Action creator for FETCH_RESULTS_SUCCESS action */
export const receiveInventoryResults = makeActionCreator(FETCH_INVENTORY_SUCCESS, 'payload');

/** Action creator for FETCH_RESULTS_FAILURE action */
export const failResults = makeActionCreator(FETCH_RESULTS_FAILURE, 'payload');

const fetchResults = (url: string, resultsAction) => {
  return async (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const { filters } = state.map.domain;
    const filtersParams = filtersToParams(filters);

    dispatch(requestResults());

    const queryParams = queryString.stringify(filtersParams);
    try {
      const { data } = await API.get(`${url}?${queryParams}`);

      dispatch(resultsAction(data));
    } catch (err) {
      dispatch(failResults({ success: false, message: getErrorMessage(err) }));
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

/** Async action to fetch results */
export function fetchDigResults() {
  return (dispatch: Dispatch) => {
    return dispatch(fetchResults(Endpoints.Digs, receiveDigResults));
  };
}

export function fetchInventoryResults() {
  return (dispatch: Dispatch) => {
    return dispatch(fetchResults(Endpoints.Inventories, receiveInventoryResults));
  };
}
