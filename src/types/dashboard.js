// @flow

import type { Filters } from './app';

export type DashboardUiState = {
  isSideMenuOpen?: boolean,
  isLoading?: boolean,
  hasLoaded?: boolean
};

export type DashboardDomainState = {
  markers: any[],
  recruiters: any[],
  filters: Filters
};

export type DashboardState = {
  ui: DashboardUiState,
  domain: DashboardDomainState
};

export type ChartProps = {
  url: string,
  columns: any[]
};
