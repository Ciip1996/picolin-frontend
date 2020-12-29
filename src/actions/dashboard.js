// @flow

import { makeActionCreator } from './index';

export const TOGGLE_MENU = 'TOGGLE_DASHBOARD_FILTERS';
export const RESET_FILTERS = 'RESET_DASHBOARD_FILTERS';
export const SAVE_FILTERS = 'SAVE_FILTERS';
export const ADD_FILTER = 'ADD_FILTER';

export const resetFilters = makeActionCreator(RESET_FILTERS);

/** Action creator for TOGGLE_MENU action */
export const toggleMenu = makeActionCreator(TOGGLE_MENU);

export const saveFilters = makeActionCreator(SAVE_FILTERS, 'payload');
export const addFilter = makeActionCreator(ADD_FILTER, 'payload');
