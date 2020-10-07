// @flow

import type { Filters } from './app';

export type MapUiState = {
  activeTab?: number,
  isSideMenuOpen?: boolean,
  isLoading?: boolean,
  hasLoaded?: boolean,
  selectedRecruiter?: any,
  lastError?: any
};

export type MapDomainState = {
  markers: Array<any>,
  recruiters: Array<any>,
  filters: Filters
};

export type MapState = {
  ui: MapUiState,
  domain: MapDomainState
};
